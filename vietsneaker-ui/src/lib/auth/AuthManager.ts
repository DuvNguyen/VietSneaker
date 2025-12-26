export class AuthManager {
  // Lấy ngay từ LocalStorage khi khởi tạo
  static accessToken: string | null = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
  static #listeners: Array<(t: string) => void> = [];

  static getAccessToken() {
    if (!this.accessToken && typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem("access_token");
    }
    return this.accessToken;
  }

  static setAccessToken(token: string | null) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem("access_token", token);
      else localStorage.removeItem("access_token");
    }
    this.#notifyListeners();
  }

  static clearAccessToken() {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem("access_token");
      // Lưu ý: Không xóa username/roles ở đây để AuthProvider vẫn biết là "đã từng login"
    }
    this.#notifyListeners();
  }

  static addListener(cb: (t: string) => void) { this.#listeners.push(cb); }
  static removeListener(cb: (t: string) => void) { this.#listeners = this.#listeners.filter(c => c !== cb); }
  static #notifyListeners() { this.#listeners.forEach(cb => cb(this.accessToken || "")); }
}