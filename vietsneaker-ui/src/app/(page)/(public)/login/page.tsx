import Link from "next/link";
import { LoginForm } from "./reset/components/login-form";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  return (
    <div className={styles.loginContainer}>
      {/* 🌆 Banner Section */}
      <div className={styles.banner}>
        <div className={styles.overlay}></div>

        {/* 🧱 Content Wrapper */}
        <div className={styles.contentWrapper}>
          {/* 🖼️ Left Banner Image */}
          <div className={styles.left}>
            <img
              src="/body.png"
              alt="banner"
              className={styles.bannerImage}
            />
          </div>

          {/* 📦 Login Box */}
          <div className={styles.loginBox}>
            {/* 🎯 Header */}
            <div className={styles.header}>
              <h2>Đăng nhập</h2>
            </div>

            {/* 🧾 Form */}
            <div className={styles.form}>
              <LoginForm />
            </div>

            {/* 🔗 Links */}
            <div className={styles.links}>
              <span>Quên mật khẩu?</span>
              <Link href="/signup" className={styles.linkItem}>
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
