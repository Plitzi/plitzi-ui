const FloatLeft = (props: { [key: string]: unknown }) => (
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
    <path d="M10.002 20.003v-16h-5a1 1 0 0 0 -1 1v14a1 1 0 0 0 1 1h5z" />
    <path d="M15.002 20.003h-.01" />
    <path d="M20.003 20.003h-.011" />
    <path d="M20.003 15.002h-.011" />
    <path d="M20.003 9.002h-.011" />
    <path d="M20.003 4.002h-.011" />
    <path d="M15.002 4.002h-.01" />
  </svg>
);

export default FloatLeft;
