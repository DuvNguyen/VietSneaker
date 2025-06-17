/**
 * Handle XSS attack to token via LocalStorage or SessionStorage
 * Use static class to storage global state
 */
export class AuthManager {
  // Callback list to notify hook variable change
  static #listeners: Array<(t: string) => void> = [];
  static addListener(callbackFn: (newToken: string) => void) {
    this.#listeners.push(callbackFn);
  }
  static removeListener(callbackFn: (newToken: string) => void) {
    this.#listeners = this.#listeners.filter((cb) => cb !== callbackFn);
  }
  static clearAccessToken() {
    this.accessToken = null;
  }

  static accessToken: string | null = null;
  static setAccessToken(token: string | null) {
    this.accessToken = token;
    this.#notifyListeners();
  }
  static getAccessToken() {
    return this.accessToken;
  }

  static #notifyListeners() {
    this.#listeners.forEach((callback) => callback(this.accessToken || ""));
  }
}
