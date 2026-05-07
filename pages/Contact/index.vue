<template>
  <div class="contact-page">
    <div class="contact-header">
      <h1 class="text-blue-700" >Liên hệ với chúng tôi</h1>
      <p>Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn.</p>
    </div>

    <div class="contact-grid">
      <section class="contact-card form-card">
        <div class="card-title-wrap ">
          <a-icon type="mail" theme="filled" class="title-icon1 "/>
          <div>
            <h2>Gửi tin nhắn cho chúng tôi</h2>
            <p>Vui lòng điền đầy đủ thông tin, chúng tôi sẽ phản hồi sớm nhất có thể.</p>
          </div>
        </div>

        <form class="contact-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Họ và tên <span>*</span></label>
            <input
              v-model.trim="form.fullName"
              type="text"
              placeholder="Nhập họ và tên của bạn"
              required
            />
          </div>

          <div class="form-group">
            <label>Email <span>*</span></label>
            <input
              v-model.trim="form.email"
              type="email"
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div class="form-group">
            <label>Số điện thoại <span>*</span></label>
            <input
              v-model.trim="form.phone"
              type="tel"
              placeholder="Nhập số điện thoại của bạn"
              required
            />
          </div>

          <div class="form-group">
            <label>Nội dung tin nhắn <span>*</span></label>
            <textarea
              v-model.trim="form.message"
              rows="5"
              placeholder="Nhập nội dung tin nhắn của bạn..."
              required
            ></textarea>
          </div>

          <button type="submit" class="submit-btn" :disabled="submitting">
            <a-icon v-if="submitting" type="loading" />
            <a-icon v-else type="send" />
            {{ submitting ? "Đang gửi..." : "Gửi tin nhắn" }}
          </button>

          <p class="privacy-note">
            <a-icon type="lock" />
            Thông tin của bạn được bảo mật và chỉ sử dụng để liên hệ hỗ trợ.
          </p>
        </form>
      </section>

      <aside class="contact-card info-card">
        <div class="card-title-wrap">
          <a-icon type="info-circle" theme="filled" class="title-icon" />
          <div>
            <h2>Thông tin liên hệ</h2>
            <p>Bạn có thể liên hệ với chúng tôi qua các kênh sau:</p>
          </div>
        </div>

        <div class="info-list">
          <div class="info-item">
            <div class="info-icon"><a-icon type="mail" /></div>
            <div>
              <div class="info-label">Email</div>
              <div class="info-value">khuongba0907@learnenglish.com</div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon"><a-icon type="phone" /></div>
            <div>
              <div class="info-label">Số điện thoại</div>
              <div class="info-value">0862048927</div>
            </div>
          </div>

          

          <div class="info-item">
            <div class="info-icon"><a-icon type="clock-circle" /></div>
            <div>
              <div class="info-label">Giờ làm việc</div>
              <div class="info-value">Thứ 2 - Thứ 6: 8:00 - 17:00</div>
              <div class="info-value">Thứ 7: 8:00 - 12:00</div>
            </div>
          </div>
        </div>

        <div class="illustration-wrap" aria-hidden="true">
          <img src="../../assets/mail.png" alt="">
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { submitContact } from "../../apis/contact";

const defaultForm = () => ({
  fullName: "",
  email: "",
  phone: "",
  message: "",
});

export default {
  name: "ContactPage",
  layout: "pageLayout",
  middleware: "auth",
  data() {
    return {
      submitting: false,
      form: defaultForm(),
    };
  },
  methods: {
    async handleSubmit() {
      if (this.submitting) return;

      this.submitting = true;
      try {
        const payload = {
          fullName: this.form.fullName,
          email: this.form.email,
          phone: this.form.phone,
          message: this.form.message,
        };
        await submitContact(payload);
        this.$message.success("Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm!");
        this.form = defaultForm();
      } catch (error) {
        const message = error?.response?.data?.message || "Gửi liên hệ thất bại. Vui lòng thử lại.";
        this.$message.error(message);
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.contact-page {
  padding: 4px;
  min-height: 100%;
}

.contact-header {
  margin-bottom: 18px;
}

.contact-header h1 {
  margin: 0;

  font-size: 34px;
  font-weight: 800;
  line-height: 1.2;
}

.contact-header p {
  margin-top: 8px;
  color: #56739e;
  font-size: 15px;
}

.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 16px;
}

.contact-card {
  background: #fff;
  border: 1px solid #e4eef9;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(25, 84, 160, 0.08);
  padding: 20px;
}

.card-title-wrap {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 16px;
}

.title-icon {
  color: #2a7be4;
  margin-top: 4px;
  font-size: 20px;
}
.title-icon1 {
  color: #2a7be4;
  margin-top: 4px;
  font-size: 26px;
}
.card-title-wrap h2 {
  margin: 0;
  font-size: 20px;
  color: #2d3f63;
  font-weight: 700;
}

.card-title-wrap p {
  margin: 4px 0 0;
  color: #7288aa;
  font-size: 13px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  color: #3b4f73;
  font-weight: 600;
}

.form-group label span {
  color: #ef4444;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  border: 1px solid #d9e4f2;
  background: #fdfefe;
  border-radius: 10px;
  font-size: 14px;
  color: #2c3f5f;
  padding: 10px 12px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #4f93e9;
  box-shadow: 0 0 0 3px rgba(79, 147, 233, 0.15);
}

.form-group textarea {
  resize: vertical;
  min-height: 112px;
}

.submit-btn {
  margin-top: 2px;
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 11px;
  background: linear-gradient(90deg, #1d67d9 0%, #3282ed 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.submit-btn .anticon {
  margin-right: 6px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(29, 103, 217, 0.26);
}

.submit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.privacy-note {
  margin: 2px 0 0;
  text-align: center;
  color: #8a9bb8;
  font-size: 12px;
}

.privacy-note .anticon {
  margin-right: 4px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #edf2fa;
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  width: 34px;
  height: 34px;
  min-width: 34px;
  border-radius: 50%;
  background: #e8f2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2f7ce7;
  font-size: 16px;
}

.info-label {
  color: #5d7498;
  font-size: 12px;
  font-weight: 600;
}

.info-value {
  color: #1e5dbf;
  font-size: 13px;
  font-weight: 700;
  margin-top: 2px;
  line-height: 1.45;
}

.illustration-wrap {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
}

.mail-illustration {
  position: relative;
  width: 170px;
  height: 120px;
}

.mail-top {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 18px;
  height: 42px;
  background: linear-gradient(180deg, #8bc3ff 0%, #4e96ef 100%);
  clip-path: polygon(0 100%, 50% 35%, 100% 100%);
  border-radius: 6px;
}

.mail-body {
  position: absolute;
  left: 16px;
  right: 16px;
  top: 36px;
  bottom: 18px;
  background: linear-gradient(180deg, #3e8bf0 0%, #2f6fd0 100%);
  border-radius: 0 0 12px 12px;
}

.mail-body::before,
.mail-body::after {
  content: "";
  position: absolute;
  top: -18px;
  width: 58%;
  height: 24px;
  background: #6da9f3;
}

.mail-body::before {
  left: -2px;
  clip-path: polygon(0 100%, 100% 0, 100% 100%);
}

.mail-body::after {
  right: -2px;
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}

.mail-shadow {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 6px;
  height: 12px;
  border-radius: 999px;
  background: rgba(35, 100, 185, 0.2);
  filter: blur(3px);
}

@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .info-card {
    order: 2;
  }
}

@media (max-width: 768px) {
  .contact-header h1 {
    font-size: 28px;
  }

  .contact-card {
    padding: 16px;
    border-radius: 14px;
  }
}
</style>
