const AlignSelfCenterRow = (props: { [key: string]: unknown }) => {
  return (
    <svg {...props} viewBox="0 0 16 16">
      <path fill="currentColor" d="M0 7h16v1H0z" />
      <path fill="currentColor" d="M6 3h4v9H6z" />
    </svg>
  );
};

export default AlignSelfCenterRow;
