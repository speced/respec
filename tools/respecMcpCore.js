import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import { toHTML } from "./respecDocWriter.js";

export const CONFIG_FILENAME = "respec-mcp.config.json";
export const AUTHORING_GUIDE_PATH = "docs/MCP_LLM_AUTHORING_GUIDE.md";

const DEFAULT_STATUS = "CG-DRAFT";
const DEFAULT_SOURCE_ROOT = "reports/source";
const DEFAULT_BUILD_ROOT = "reports/build";

export async function loadJson(filePath) {
  const source = await readFile(filePath, "utf-8");
  return JSON.parse(source);
}

export async function fileExists(filePath) {
  try {
    await readFile(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function loadRepoConfig(repoRoot) {
  const resolvedRoot = path.resolve(repoRoot || process.cwd());
  const configPath = path.join(resolvedRoot, CONFIG_FILENAME);
  const hasConfig = await fileExists(configPath);
  const repoConfig = hasConfig
    ? await loadJson(configPath)
    : {
        default_profile: null,
        profile_directory: "respec-mcp/profiles",
        source_root: DEFAULT_SOURCE_ROOT,
        build_root: DEFAULT_BUILD_ROOT,
      };

  return {
    repoRoot: resolvedRoot,
    configPath: hasConfig ? configPath : null,
    config: repoConfig,
  };
}

export async function listProfiles(repoRoot) {
  const repoState = await loadRepoConfig(repoRoot);
  const profiles = await loadProfiles(repoState);
  return {
    repo_root: repoState.repoRoot,
    config_path: repoState.configPath,
    authoring_guidance_path: AUTHORING_GUIDE_PATH,
    default_profile: repoState.config.default_profile || null,
    profiles: profiles.map(profile => ({
      profile_id: profile.profile_id,
      label: profile.label || profile.profile_id,
      allowed_statuses: profile.allowed_statuses || [],
      default_status: profile.default_status || DEFAULT_STATUS,
      repo_metadata_source: profile.repo_metadata_source || null,
    })),
  };
}

export async function scaffoldSource(input, options = {}) {
  const state = await resolveContext(input, options);
  const metadata = await loadRepoMetadata(state.repoRoot, state.profile.repo_metadata_source);
  const sourcePath = resolveScaffoldPath(state, input.output);
  const templatePath = resolveTemplatePath(state.profile, state.status, state.repoRoot);
  const template = await readFile(templatePath, "utf-8");
  const rendered = applyTemplate(
    template,
    buildTemplateContext(state, metadata, input.overrides)
  );
  await mkdir(path.dirname(sourcePath), { recursive: true });
  await writeFile(sourcePath, rendered, "utf-8");

  const compliance = await evaluateCompliance({
    html: rendered,
    sourceText: rendered,
    profile: state.profile,
    repoRoot: state.repoRoot,
    status: state.status,
    errors: [],
    warnings: [],
  });

  return {
    source: sourcePath,
    output: sourcePath,
    status: state.status,
    authoring_guidance_path: AUTHORING_GUIDE_PATH,
    errors: [],
    warnings: [],
    compliance,
    resolved_profile: summarizeProfile(state.profile),
    resolved_repo_config: summarizeRepoConfig(state.repoState),
  };
}

export async function buildSpec(input, options = {}) {
  return renderAndAssess(input, options, { writeOutput: true });
}

export async function validateSpec(input, options = {}) {
  return renderAndAssess(input, options, { writeOutput: false });
}

export async function preflightSpec(input, options = {}) {
  return renderAndAssess(input, options, { writeOutput: false });
}

async function renderAndAssess(input, options, behavior) {
  const state = await resolveContext(input, options);
  const sourceRef = resolveSourceReference(state, input.source);
  const sourceUrl = toSourceUrl(sourceRef, state.repoRoot);
  const sourceText = await readSourceText(sourceRef, state.repoRoot);
  const outputPath =
    behavior.writeOutput && resolveOutputPath(state, input.output, sourceRef);
  const errors = [];
  const warnings = [];
  const { html, errors: rsErrors, warnings: rsWarnings } = await toHTML(sourceUrl, {
    timeout: options.timeout || 300000,
    useLocal: Boolean(options.useLocal),
    disableSandbox: Boolean(options.disableSandbox),
    disableGPU: Boolean(options.disableGPU),
    devtools: Boolean(options.devtools),
    onError: error => errors.push(sanitizeReSpecError(error)),
    onWarning: warning => warnings.push(sanitizeReSpecError(warning)),
  });

  // Keep the callback arrays authoritative if ReSpec returns duplicates or a future
  // version stops pushing via callbacks.
  if (!errors.length && rsErrors.length) {
    errors.push(...rsErrors.map(sanitizeReSpecError));
  }
  if (!warnings.length && rsWarnings.length) {
    warnings.push(...rsWarnings.map(sanitizeReSpecError));
  }

  const compliance = await evaluateCompliance({
    html,
    sourceText,
    profile: state.profile,
    repoRoot: state.repoRoot,
    status: state.status,
    errors,
    warnings,
  });

  if (outputPath) {
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html, "utf-8");
  }

  return {
    source: sourceUrl,
    output: outputPath || null,
    status: state.status,
    authoring_guidance_path: AUTHORING_GUIDE_PATH,
    errors,
    warnings,
    compliance,
    resolved_profile: summarizeProfile(state.profile),
    resolved_repo_config: summarizeRepoConfig(state.repoState),
  };
}

async function resolveContext(input, options) {
  const repoRoot = path.resolve(
    input.repo_root || options.defaultRepoRoot || process.cwd()
  );
  const repoState = await loadRepoConfig(repoRoot);
  const profiles = await loadProfiles(repoState);
  const profileId =
    input.profile ||
    options.defaultProfile ||
    repoState.config.default_profile ||
    profiles[0]?.profile_id;

  if (!profileId) {
    throw new Error(
      `No profiles are configured for ${repoRoot}. Add ${CONFIG_FILENAME} and a profile JSON file.`
    );
  }

  const profile = profiles.find(item => item.profile_id === profileId);
  if (!profile) {
    throw new Error(`Profile "${profileId}" was not found under ${repoRoot}.`);
  }

  const status =
    input.status || profile.default_status || repoState.config.default_status || DEFAULT_STATUS;
  ensureStatusAllowed(profile, status);

  return {
    repoRoot,
    repoState,
    profile,
    status,
  };
}

async function loadProfiles(repoState) {
  const config = repoState.config;
  const configuredProfiles = Array.isArray(config.profile_paths)
    ? config.profile_paths
    : [];
  const discoveredProfiles = configuredProfiles.length
    ? configuredProfiles
    : await discoverProfiles(repoState.repoRoot, config.profile_directory);

  const loaded = [];
  for (const item of discoveredProfiles) {
    const profilePath = path.resolve(repoState.repoRoot, item);
    const profile = await loadJson(profilePath);
    loaded.push({
      ...profile,
      __path: profilePath,
    });
  }
  return loaded;
}

async function discoverProfiles(repoRoot, profileDirectory = "respec-mcp/profiles") {
  const profileRoot = path.resolve(repoRoot, profileDirectory);
  try {
    const entries = await readdir(profileRoot, { withFileTypes: true });
    return entries
      .filter(entry => entry.isFile() && entry.name.endsWith(".json"))
      .map(entry => path.join(profileDirectory, entry.name))
      .sort();
  } catch {
    return [];
  }
}

function ensureStatusAllowed(profile, status) {
  const allowed = profile.allowed_statuses || [];
  if (allowed.length && !allowed.includes(status)) {
    throw new Error(
      `Status "${status}" is not allowed for profile "${profile.profile_id}". Allowed: ${allowed.join(", ")}`
    );
  }
}

function resolveSourceReference(state, sourceInput) {
  const source =
    sourceInput ||
    state.profile.default_source ||
    joinIfPresent(state.repoState.config.source_root, "index.html");
  if (!source) {
    throw new Error(
      `No source was provided and profile "${state.profile.profile_id}" has no default_source.`
    );
  }
  return source;
}

function resolveScaffoldPath(state, output) {
  if (output) {
    return path.resolve(state.repoRoot, output);
  }

  const defaultSource =
    state.profile.default_source ||
    path.join(state.repoState.config.source_root || DEFAULT_SOURCE_ROOT, "index.html");
  return path.resolve(state.repoRoot, defaultSource);
}

function resolveTemplatePath(profile, status, repoRoot) {
  const byStatus = profile.status_templates || {};
  const templatePath = byStatus[status] || profile.template_path;
  if (!templatePath) {
    throw new Error(
      `Profile "${profile.profile_id}" does not define a template for status "${status}".`
    );
  }
  return path.resolve(repoRoot, templatePath);
}

function resolveOutputPath(state, explicitOutput, sourceRef) {
  if (explicitOutput) {
    return path.resolve(state.repoRoot, explicitOutput);
  }

  if (/^\w+:\/\//.test(sourceRef)) {
    return null;
  }

  const buildRoot =
    state.profile.build_root ||
    state.repoState.config.build_root ||
    DEFAULT_BUILD_ROOT;
  const sourceRoot =
    state.profile.source_root ||
    state.repoState.config.source_root ||
    DEFAULT_SOURCE_ROOT;

  const absoluteSource = path.resolve(state.repoRoot, sourceRef);
  const absoluteSourceRoot = path.resolve(state.repoRoot, sourceRoot);
  const absoluteBuildRoot = path.resolve(state.repoRoot, buildRoot);

  if (absoluteSource.startsWith(`${absoluteSourceRoot}${path.sep}`)) {
    const relative = path.relative(absoluteSourceRoot, absoluteSource);
    return path.resolve(absoluteBuildRoot, relative);
  }

  return path.resolve(absoluteBuildRoot, path.basename(absoluteSource));
}

function toSourceUrl(sourceRef, repoRoot) {
  if (/^\w+:\/\//.test(sourceRef)) {
    return sourceRef;
  }
  const absolutePath = path.isAbsolute(sourceRef)
    ? sourceRef
    : path.resolve(repoRoot, sourceRef);
  return pathToFileURL(absolutePath).href;
}

async function readSourceText(sourceRef, repoRoot) {
  if (/^\w+:\/\//.test(sourceRef)) {
    const response = await fetch(sourceRef);
    if (!response.ok) {
      throw new Error(`Failed to fetch source ${sourceRef}: ${response.status}`);
    }
    return await response.text();
  }
  return await readFile(path.resolve(repoRoot, sourceRef), "utf-8");
}

async function evaluateCompliance({
  html,
  sourceText,
  profile,
  repoRoot,
  status,
  errors,
  warnings,
}) {
  const metadata = await loadRepoMetadata(repoRoot, profile.repo_metadata_source);
  const htmlLower = html.toLowerCase();
  const sourceLower = sourceText.toLowerCase();
  const requiredSectionsMissing = (profile.required_sections || []).filter(
    section => !htmlLower.includes(section.toLowerCase())
  );
  const requiredLinksMissing = (profile.required_links || []).filter(
    link => !html.includes(link)
  );
  const forbiddenPhraseHits = (profile.forbidden_phrases || []).filter(phrase => {
    const lowerPhrase = phrase.toLowerCase();
    return htmlLower.includes(lowerPhrase) || sourceLower.includes(lowerPhrase);
  });

  const metadataChecks = {
    found: metadata.found,
    path: metadata.path,
    group_id: metadata.groupId,
    repo_type: metadata.repoType,
    expected_group_type: profile.group_type || null,
  };

  return {
    valid:
      !errors.length &&
      !requiredSectionsMissing.length &&
      !requiredLinksMissing.length &&
      !forbiddenPhraseHits.length,
    status_allowed:
      !profile.allowed_statuses ||
      !profile.allowed_statuses.length ||
      profile.allowed_statuses.includes(status),
    metadata_checks: metadataChecks,
    required_sections_missing: requiredSectionsMissing,
    required_links_missing: requiredLinksMissing,
    forbidden_phrase_hits: forbiddenPhraseHits,
    warnings_count: warnings.length,
    errors_count: errors.length,
  };
}

async function loadRepoMetadata(repoRoot, metadataSource) {
  if (!metadataSource) {
    return {
      found: false,
      path: null,
      groupId: null,
      repoType: null,
    };
  }

  const metadataPath = path.resolve(repoRoot, metadataSource);
  if (!(await fileExists(metadataPath))) {
    return {
      found: false,
      path: metadataPath,
      groupId: null,
      repoType: null,
    };
  }

  const metadata = await loadJson(metadataPath);
  return {
    found: true,
    path: metadataPath,
    groupId: Array.isArray(metadata.group) ? metadata.group[0] : null,
    repoType: metadata["repo-type"] || null,
  };
}

function buildTemplateContext(state, metadata, overrides = {}) {
  const repoDefaults = state.repoState.config.template_defaults || {};
  const profileDefaults = state.profile.respec_defaults || {};

  const merged = {
    title: "Untitled Community Group Report",
    subtitle: "",
    shortName: "pm-kr",
    group: null,
    github: null,
    latestVersion: null,
    editors: [],
    publishDate: new Date().toISOString().slice(0, 10),
    specStatus: state.status,
    groupId: metadata.groupId,
    repoType: metadata.repoType,
    ...repoDefaults,
    ...profileDefaults,
    ...overrides,
  };

  return addJsonValues(merged);
}

function addJsonValues(values) {
  const result = { ...values };
  for (const [key, value] of Object.entries(values)) {
    result[`${key}Json`] = JSON.stringify(value);
  }
  return result;
}

function applyTemplate(template, values) {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, key) => {
    if (!(key in values)) {
      return "";
    }
    const value = values[key];
    return value === null || value === undefined ? "" : String(value);
  });
}

function sanitizeReSpecError(error) {
  return {
    message: error.message,
    plugin: error.plugin || null,
    hint: error.hint || null,
  };
}

function summarizeProfile(profile) {
  return {
    profile_id: profile.profile_id,
    label: profile.label || profile.profile_id,
    allowed_statuses: profile.allowed_statuses || [],
    default_status: profile.default_status || DEFAULT_STATUS,
    source_root: profile.source_root || null,
    build_root: profile.build_root || null,
    repo_metadata_source: profile.repo_metadata_source || null,
  };
}

function summarizeRepoConfig(repoState) {
  return {
    repo_root: repoState.repoRoot,
    config_path: repoState.configPath,
    default_profile: repoState.config.default_profile || null,
    source_root: repoState.config.source_root || DEFAULT_SOURCE_ROOT,
    build_root: repoState.config.build_root || DEFAULT_BUILD_ROOT,
  };
}

function joinIfPresent(root, leaf) {
  return root ? path.join(root, leaf) : null;
}
