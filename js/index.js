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
      qrMax: 1280,
      qrColor1: '#000000',
      qrColor2: '#FFFFFF',
      qrColor3: '#AA8800',
      qrColor4: '#FFF8F0',
      logoText: '',
      logoRatio: 0.8
  },
  computed: {
    drawLogo: function () {
      return this.logoText.length > 0;
    },
    qrCode: function() {
      //if (this.qrSize < this.qrMin) this.qrSize = this.qrMin;
      //if (this.qrSize > this.qrMax) this.qrSize = this.qrMax;

      if (this.qrUrl) {
        var size = this.qrSize < this.qrMin ?
          this.qrMin :
          (this.qrSize > this.qrMax ?
            this.qrMax :
            this.qrSize);
        var qr = new QRious({
          element: this.qrCanvas,
          level: this.drawLogo ? 'H' : 'M',
          size: size,
          value: this.qrUrl,
          foreground: this.qrColor1,
          background: this.qrColor2
        });

        if (this.drawLogo) {
          var ctx = this.qrCanvas.getContext('2d'),
              len = 0.5 * size,
              logoSize = this.getLogoSize();
         console.log(logoSize);

          ctx.font = '900 ' + logoSize + 'px Helvetica';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.lineJoin = 'round';
          ctx.lineWidth = 0.2 * logoSize;
          ctx.strokeStyle = this.qrColor4;
          ctx.strokeText(this.logoText, len, len);
          ctx.fillStyle = this.qrColor3;
          ctx.fillText(this.logoText, len, len);
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
    getLogoSize: function () {
      if (this.logoText.length > 0) {
        var factor = 1 - 64 / (this.qrUrl.length + 128);
        return Math.sqrt(0.22 * factor * this.logoRatio * this.qrSize * this.qrSize / this.getFullSizeCount(this.logoText));
      } else {
        return 0;
      }
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
