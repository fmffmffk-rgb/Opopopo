const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

let subscriptions = []; // كل المشتركين

// ضع المفاتيح التي تولدها
const publicVapidKey = "YOUR_PUBLIC_VAPID_KEY";
const privateVapidKey = "YOUR_PRIVATE_VAPID_KEY";

webpush.setVapidDetails('mailto:you@example.com', publicVapidKey, privateVapidKey);

// حفظ الاشتراكات
app.post('/subscribe', (req,res)=>{
  subscriptions.push(req.body.subscription);
  res.sendStatus(201);
});

// إرسال إشعار لكل المشتركين كل دقيقتين
setInterval(()=>{
  subscriptions.forEach(async sub => {
    try {
      await webpush.sendNotification(sub, JSON.stringify({
        title: "حمّل تطبيقنا الآن!",
        body: "اضغط هنا لتحميل التطبيق",
        url: "https://play.google.com/store/apps/details?id=com.example.app"
      }));
    } catch(e) {
      console.error("فشل الإرسال:", e);
    }
  });
  console.log("تم إرسال الإشعارات لكل المشتركين");
}, 120000); // كل 120000 مللي ثانية = 2 دقيقة

app.listen(3000, ()=>console.log("Server running on 3000"));
