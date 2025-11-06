export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
      <nav className="pl-20">
        <h6 className="footer-title">Dịch vụ khách hàng</h6>
        <a className="link link-hover">Trung tâm trợ giúp</a>
        <a className="link link-hover">Hướng dẫn mua hàng</a>
        <a className="link link-hover">Chính sách bảo mật</a>
      </nav>

      <nav className="pl-10">
        <h6 className="footer-title">VietSneaker thông tin</h6>
        <a className="link link-hover">Về VietSneaker</a>
        <a className="link link-hover">Tuyển dụng</a>
        <a className="link link-hover">Flash Sale</a>
      </nav>

      <nav className="pl-10">
        <h6 className="footer-title">Thanh toán</h6>
        <a className="link link-hover">💳 VISA</a>
        <a className="link link-hover">🏦 Momo</a>
      </nav>

      <nav className="pl-10">
        <h6 className="footer-title">Tải ứng dụng VietSneaker</h6>
        <a className="link link-hover">📱 App Store</a>
        <a className="link link-hover">📱 Google Play</a>
      </nav>
    </footer>
  );
}
