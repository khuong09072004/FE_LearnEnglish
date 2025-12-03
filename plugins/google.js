export default ({ app }, inject) => {
  // Tạo script Google Identity
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;

  // Gắn vào <head>
  document.head.appendChild(script);

  // Trả về promise đợi script load xong
  const waitForGoogle = new Promise((resolve) => {
    script.onload = () => {
      resolve(window.google);
    };
  });

  inject("googleAuth", {
    async initialize(callback) {
      const google = await waitForGoogle;
      google.accounts.id.initialize({
        client_id:
          "727615398684-s3ef29ffbr1s40vl9ah4bnoqrpklokrq.apps.googleusercontent.com",
        callback,
      });
    },

    async renderButton(elementId) {
      const google = await waitForGoogle;
      google.accounts.id.renderButton(
        document.getElementById(elementId),
        { theme: "outline", size: "large" }
      );
    },

    async prompt() {
      const google = await waitForGoogle;
      google.accounts.id.prompt();
    },
  });
};
