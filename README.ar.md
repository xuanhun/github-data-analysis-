<div align="center">

> ⚠️ **ملاحظة الترجمة:** تمت ترجمة هذه الوثيقة بواسطة الذكاء الاصطناعي. إذا وجدت أخطاء، يرجى الإبلاغ عنها. شكراً!

هذا المشروع هو نسخة من <b>star-history/star-history</b> وتم تحسينه. لن يقوم بدمج الكود مرة أخرى في المشروع الأصلي.

# :sparkles: gitdata analysis :sparkles:

[**gitdata.xuanhun520.com**](https://gitdata.xuanhun520.com)، **يوفر إمكانيات إحصائيات البيانات والتصور المفقودة لمستودعات GitHub، مثل وظيفة مخطط تاريخ النجوم.**

<picture>
  <source media="(prefers-color-scheme: dark) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
</picture>

👆 **هذا** هو مخطط **`مباشر`** تم إنشاؤه باستخدام كود HTML التالي: 👇

<div align="left">

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
</picture>
```

</div>

</div>

---

## ✨ الميزات

- مبني على [VChart](https://github.com/VisActor/VChart).
- دعم عرض البيانات التفصيلية
- إنشاء **بنقرة واحدة** لصور المخططات **عالية الجودة**;
- دعم **أوضاع عرض متعددة** للمخططات، **`بناءً على التاريخ أو الجدول الزمني`**;
- **تضمين** **مخططات في الوقت الفعلي** في **`GitHub readme أو مواقع أخرى`** **(مثل المثال الذي قمنا بتضمينه في الأعلى)**;
- و **وظائف** **مفيدة** متنوعة:
  - تبديل **رؤية المستودع**;
  - **اختصار** لإدخال اسم المستودع;
  - **مشاركة سريعة** على **`الشبكات الاجتماعية`**;
  - **دعم** إدخال **مستودعات متعددة**;
  - ...المزيد من الميزات في انتظار **اكتشافها!**

## 🌠 لقطات الشاشة

<a href="https://gitdata.xuanhun520.com"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154391264-312b448b-f851-41bf-bb8d-4c21ec6795b6.gif" />
</a>



## 🏗 التطوير

**`Star-history`** مبني باستخدام **مجموعة تقنيات حديثة**: **`Vue`** + **`Vite`** + **`TailwindCSS`** + **`@Visactor/VChart`**.

### المتطلبات الأساسية

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/)

### تثبيت التبعيات

```shell
pnpm i
```

### بدء التطوير

- **الموقع الرئيسي** هو الصفحة الرئيسية لـ gitdata، ويحتوي على معظم **الميزات المفيدة والمدونات** حول **`VisActor مفتوح المصدر`**.

  ```shell
  pnpm dev
  ```

  سيتم تقديم الموقع على http://localhost:3000.

- **خادم API** هو **`ميزة تجريبية`**. يُستخدم بشكل أساسي لـ **إنشاء ملفات صور المخططات `SVG` أو `PNG`** التي يمكن تضمينها في **`GitHub readme`**.

  #### المتطلبات الأساسية لخادم API

  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) (لتخزين بيانات المستودع مؤقتاً)

  #### تثبيت MongoDB Community Server

  **ملاحظة:** بعد تغيير كلمة المرور، تذكر تحديث سلسلة الاتصال في ملف `.env` أو متغيرات البيئة.

  **تعيين متغيرات البيئة:**

  يمكن تعديل تكوين MongoDB وفقاً لحالتك الفعلية.

  ```shell
  # تعيين سلسلة اتصال MongoDB
  export MONGODB_URI="mongodb://[username]:[password]@localhost:27017/gitdata"
  export MONGODB_DB_NAME="gitdata"
  export MONGODB_COLLECTION_NAME="repo_cache"
  ```

  أو إنشاء ملف `.env` في دليل `server`:

  ```env
  MONGODB_URI=mongodb://xuanhun:xuanhun@localhost:27017/gitdata
  MONGODB_DB_NAME=gitdata
  MONGODB_COLLECTION_NAME=repo_cache
  ```

  #### بدء خادم API

  ```shell
  cd server
  pnpm i && pnpm dev
  ```

  سيعمل خادم API على http://localhost:8080 (أو https://localhost:8080 إذا تم تمكين HTTPS).

  #### الرمز المميز

  تتطلب خدمة الخلفية رمز GitHub الخاص بك، الموضع في ملف `token.env`.

  ### تمكين دعم HTTPS

  لتمكين HTTPS للواجهة الأمامية:

  1. **إنشاء شهادات SSL** (للتطوير):

     ```shell
     ./scripts/generate-ssl-cert.sh
     ```

     سيؤدي هذا إلى إنشاء شهادات موقعة ذاتياً في دليل `certs/`.

  2. **لل واجهة الأمامية (Vite)**:

     سيستخدم خادم التطوير Vite HTTPS تلقائياً إذا تم العثور على شهادات في دليل `certs/`، أو يمكنك تحديد مسارات مخصصة:

     ```shell
     export SSL_CERT_PATH=/path/to/cert.crt
     export SSL_KEY_PATH=/path/to/key.key
     pnpm dev
     ```

## الخطط المستقبلية

- إضافة المزيد من ميزات التحرير والتعليقات التوضيحية
- عرض وتحرير كود VChart، تصدير إلى محرر VChart الرسمي
- إنشاء مقاطع فيديو متحركة لتاريخ النجوم (GIF)
- المزيد من إحصائيات ووظائف تحليل بيانات GitHub
