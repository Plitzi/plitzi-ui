const BorderPlacementCenter = (props: { [key: string]: unknown }) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
    <path d="M12 8l0 .01" />
    <path d="M8 12l0 .01" />
    <path d="M12 12l0 .01" />
    <path d="M16 12l0 .01" />
    <path d="M12 16l0 .01" />
  </svg>
);

export default BorderPlacementCenter;
