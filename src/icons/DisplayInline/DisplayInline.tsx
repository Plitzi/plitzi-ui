const DisplayInline = (props: { [key: string]: unknown }) => (
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
    <path d="M4 20h16" />
    <path d="M8 16v-8a4 4 0 1 1 8 0v8" />
    <path d="M8 10h8" />
  </svg>
);

export default DisplayInline;
