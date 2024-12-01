const snapToGrid = (pendingX: number, pendingY: number, grid: number[]) => {
  const x = Math.round(pendingX / grid[0]) * grid[0];
  const y = Math.round(pendingY / grid[1]) * grid[1];

  return [x, y];
};

export { snapToGrid };
