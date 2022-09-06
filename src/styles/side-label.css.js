/* For assertions in lists containing algorithms */
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
  .sidelabel {
    position: fixed;
    top: 0;
    left: 0;
    padding: 18px 1px 48px 0;
    color: white;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: scaleX(-1) scaleY(-1);
    z-index: 1;
  }
`;
