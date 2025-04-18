const ListLetters = (props: { [key: string]: unknown }) => (
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
    <path d="M11 6h9" />
    <path d="M11 12h9" />
    <path d="M11 18h9" />
    <path d="M4 10v-4.5a1.5 1.5 0 0 1 3 0v4.5" />
    <path d="M4 8h3" />
    <path d="M4 20h1.5a1.5 1.5 0 0 0 0 -3h-1.5h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6z" />
  </svg>
);

export default ListLetters;
