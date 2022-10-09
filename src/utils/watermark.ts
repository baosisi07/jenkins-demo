import api from "../http/api";
import { userInfoStore } from "../stores/userInfo";
import locationByBaidu from "../utils/location";
const userStore = userInfoStore();
export const dwmConfig = {
  font: "microsoft yahei", //字体
  lineHeight: 1.2,
  textArray: [] as string[], // 文本内容
};
function changeTimeFormat(time: number) {
  const date = new Date(time);
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const currentDate =
    date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const mm =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return (
    date.getFullYear() + "-" + month + "-" + currentDate + " " + hh + ":" + mm
  );
  //返回格式：yyyy-MM-dd hh:mm
}
export const base64AddWaterMaker = async (base64Img: string) => {
  const wmConfig = dwmConfig;
  // 先定位获取经纬度
  locationByBaidu();
  // 获取服务端时间
  const { time } = await api.task.getTime();
  const timestr = changeTimeFormat(time);
  wmConfig.textArray = [];
  wmConfig.textArray.push(`时间： ${timestr}`);
  wmConfig.textArray.push(
    `经纬度： ${userStore.location.lng}, ${userStore.location.lat}`
  );
  if (wmConfig.textArray.length === 0) {
    console.error("****没有水印内容*****");
    return base64Img;
  }
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    let resultBase64 = null;
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      //canvas绘制图片，0 0 为左上角坐标原点
      ctx?.drawImage(img, 0, 0);
      //写入水印
      drawWaterMark(ctx, img.width, img.height, wmConfig);
      resultBase64 = canvas.toDataURL("image/png");
      if (!resultBase64) {
        reject();
      } else {
        resolve(resultBase64);
      }
    };
    img.src = base64Img;
  });
};

const drawWaterMark = (
  ctx: any,
  imgWidth: number,
  imgHeight: number,
  wmConfig: any
) => {
  let fontSize: number;
  if (imgWidth >= 3456) {
    fontSize = 50;
  } else if (imgWidth >= 2700) {
    fontSize = 30;
  } else if (imgWidth >= 2000) {
    fontSize = 26;
  } else if (imgWidth >= 1436) {
    fontSize = 20;
  } else if (imgWidth >= 800) {
    fontSize = 12;
  } else if (imgWidth >= 500) {
    fontSize = 10;
  } else {
    fontSize = 8;
  }
  console.log(imgWidth, imgHeight, fontSize);
  ctx.fillStyle = "white";
  ctx.font = `${fontSize}px ${wmConfig.font}`;
  ctx.lineHeight = wmConfig.lineHeight;
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  //文字坐标
  for (let i = 0; i < wmConfig.textArray.length; i++) {
    ctx.fillText(
      wmConfig.textArray[i],
      fontSize,
      imgHeight -
        fontSize * (wmConfig.textArray.length + 1 - i) * wmConfig.lineHeight
    );
  }
};
//将dataURL转成文件(file)格式
export const dataURLtoFile = (urlData: any) => {
  const arr = urlData.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};
