/* global global */

export * from "./SpecHelperCore.js";
import expect from "expect";
import { mochaGlobals } from "tap";

mochaGlobals();
global.afterAll = global.after;
global.beforeAll = global.before;
global.expect = expect;
