// js for index.pug
new Vue({
  el: '#QRapp',
  data: {
      isOpened: false,
      toastTime: 3000,
      qrCanvas: null,
      qrUrl: '',
      qrSize: 600,
      qrMin: 64,
      qrMax: 1440,
      qrColor1: '#000000',
      qrColor2: '#FFFFFF',
      qrColor3: '#AA8800',
      qrColor4: '#FFF8F0',
      logoType: '',
      logoText: '',
      logoImg: null,
      logoScaling: 0.75
  },
  computed: {
    drawTextLogo: function () {
      return this.logoType == 'text' && this.logoText.length > 0;
    },
    drawImgLogo: function () {
      return this.logoType == 'image' && this.logoImg;
    },
    drawLogo: function () {
      return this.drawTextLogo || this.drawImgLogo;
    },
    drawSize: function () {
      return this.qrSize < this.qrMin ?
        this.qrMin :
        (this.qrSize > this.qrMax ?
          this.qrMax :
          this.qrSize);
    },
    qrCode: function() {
      if (this.qrUrl) {
        var qr = new QRious({
          element: this.qrCanvas,
          level: this.drawLogo ? 'H' : 'M',
          size: this.drawSize,
          value: this.qrUrl,
          foreground: this.qrColor1,
          background: this.qrColor2
        });

        if (this.drawLogo) {
          var ctx = this.qrCanvas.getContext('2d');

          if (this.drawTextLogo) {
            var len = 0.5 * this.drawSize,
              logoFontSize = this.getLogoSize(this.getFullSizeCount(this.logoText));

            ctx.font = '900 ' + logoFontSize + 'px Helvetica';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 0.2 * logoFontSize;
            ctx.strokeStyle = this.qrColor4;
            ctx.strokeText(this.logoText, len, len);
            ctx.fillStyle = this.qrColor3;
            ctx.fillText(this.logoText, len, len);
          }
          else if (this.drawImgLogo) {
            var imgRatio = this.logoImg.width / this.logoImg.height,
              drawHeight = this.getLogoSize(imgRatio),
              drawWidth = imgRatio * drawHeight;

            ctx.drawImage(this.logoImg, 0.5 * (this.drawSize - drawWidth), 0.5 * (this.drawSize - drawHeight), drawWidth, drawHeight);
          }
        }
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    getFullSizeCount: function (text) {
      var fullSizeCount = (text.match(/[\u3000-\uFF60\uFFE0-\uFFE6]/g) || []).length;
      return 0.5 * (fullSizeCount + text.length);
    },
    getLogoSize: function (aspectRatio) {
      if (aspectRatio > 0) {
        var factor = 1 - 64 / (this.qrUrl.length + 128);
        return Math.sqrt(0.24 * factor * this.qrSize * this.qrSize / aspectRatio) * this.logoScaling;
      } else {
        return 0;
      }
    },
    handleLogoImg: function (e) {
      var reader = new FileReader();
      reader.onload = (event) => {
        var img = new Image();
        img.onload = () => {
          this.logoImg = img;
          var imgRatio = img.width / img.height,
            drawHeight = this.getLogoSize(imgRatio),
            drawWidth = imgRatio * drawHeight;

          this.qrCanvas.getContext('2d').drawImage(img, 0.5 * (this.drawSize - drawWidth), 0.5 * (this.drawSize - drawHeight), drawWidth, drawHeight);
        }
        console.log(event);
        img.src = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
    },
    saveBlobAs: function (blob, fileName) {
      var a = document.createElement("a");
      a.style = "display: none";
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      //window.URL.revokeObjectURL(url);
      a.parentNode.removeChild(a);
    },
    downloadQRCode: function() {
      if (this.qrCode) {
        if (this.qrCanvas.width > 0) {
          this.qrCanvas.toBlob((blob) => {
            this.saveBlobAs(blob, 'my-QRcode.png');
          });
        } else {
          alert('參數錯誤');
        }
      } else {
        alert('請輸入 QR Code 連結');
      }
    },
  },
  mounted: function() {
    this.qrCanvas = document.getElementById("qrCode");
  }
})
