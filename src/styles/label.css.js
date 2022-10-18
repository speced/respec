/* For assertions in lists containing algorithms */
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
  .sidelabel {
    position: fixed;
    -webkit-transform-origin: top right;
    right: 100%;
    top: 0;
    -webkit-transform: rotate(-90deg);
    padding: 4px 50px 4px 10px;
    color: white;
    //writing-mode: vertical-rl;
    //text-orientation: mixed;
    //transform: scaleX(-1) scaleY(-1);
    white-space: nowrap;
    z-index: 1;
  }
`;
