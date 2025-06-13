class ContentLoadingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AwsError';
  }
}

export default ContentLoadingError;
