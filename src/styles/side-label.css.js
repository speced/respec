/* For assertions in lists containing algorithms */
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
  .sidelabel {
    position: fixed;
    top: 200px;
    left: 30px;
    padding: 4px 50px 4px 4px;
    color: white;
    //writing-mode: vertical-rl;
    //text-orientation: mixed;
    //transform: scaleX(-1) scaleY(-1);
    transform-origin: bottom left;
    transform: rotate(-90deg);
    z-index: 1;
  }
`;
