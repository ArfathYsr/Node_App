import { injectable } from 'inversify';

@injectable()
export default class StringTransformService {
  public toCamelCase(str: string): string {
    if (str === 'ID') {
      return str.replace(/([A-Z])/g, (match) => match.toLowerCase());
    }
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  public convertKeysToCamelCase<T>(obj: T): T {
    if (Array.isArray(obj)) {
      return obj.map(this.convertKeysToCamelCase.bind(this)) as T;
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        const camelKey = this.toCamelCase(key);
        acc[camelKey] = value;
        return acc;
      }, {} as any);
    }
    return obj;
  }

  public toPascalCase(str: string): string {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
}
