const FloatRight = (props: { [key: string]: unknown }) => (
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
    <path d="M13.998 20.003v-16h5a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-5z" />
    <path d="M8.998 20.003h.01" />
    <path d="M3.997 20.003h.011" />
    <path d="M3.997 15.002h.011" />
    <path d="M3.997 9.002h.011" />
    <path d="M3.997 4.002h.011" />
    <path d="M8.998 4.002h.01" />
  </svg>
);

export default FloatRight;
