
export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'dark'
      ? {
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
        }
      : {
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
        }),
  },
});
