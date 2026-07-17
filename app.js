(function () {
  var form = document.getElementById("requestForm");
  var error = document.getElementById("error");
  var button = document.getElementById("submitButton");
  var formPage = document.getElementById("formPage");
  var successPage = document.getElementById("successPage");
  var recipient = (window.FORM_CONFIG && window.FORM_CONFIG.recipientEmail || "").trim();

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    error.textContent = "";
    var phone = String(new FormData(form).get("联系方式") || "").replace(/\s/g, "");
    if (!/^1[3-9]\d{9}$/.test(phone)) return showError("请输入正确的中国大陆手机号码");
    if (!form.querySelector('input[name="项目类型"]:checked')) return showError("请至少选择一个项目类型");
    if (!recipient || recipient.indexOf("请替换") > -1 || recipient.indexOf("@") < 1) return showError("接收邮箱尚未配置，请联系页面管理员。");

    button.disabled = true;
    button.innerHTML = "正在提交…";
    var data = new FormData(form);
    data.append("_subject", "【公众号】新的科研项目需求");
    data.append("_template", "table");
    data.append("_captcha", "false");
    try {
      var response = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(recipient), { method: "POST", headers: { Accept: "application/json" }, body: data });
      if (!response.ok) throw new Error("submit failed");
      form.reset();
      formPage.hidden = true;
      successPage.hidden = false;
      window.scrollTo(0, 0);
    } catch (_) {
      showError("提交未成功，请检查网络后重试，或直接联系您的市场顾问。");
    } finally {
      button.disabled = false;
      button.innerHTML = "提交需求 <span>→</span>";
    }
  });

  document.getElementById("againButton").addEventListener("click", function () { successPage.hidden = true; formPage.hidden = false; window.scrollTo(0, 0); });
  function showError(message) { error.textContent = message; error.scrollIntoView({ behavior: "smooth", block: "center" }); }
})();
