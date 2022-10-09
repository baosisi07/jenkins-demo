import { useDetailStore } from "../stores/taskDetail";
//关于状态码
const BMAP_STATUS_SUCCESS = 0; //检索成功。对应数值“0”。
const BMAP_STATUS_CITY_LIST = 1; //城市列表。对应数值“1”。
const BMAP_STATUS_UNKNOWN_LOCATION = 2; //位置结果未知。对应数值“2”。
const BMAP_STATUS_UNKNOWN_ROUTE = 3; //导航结果未知。对应数值“3”。
const BMAP_STATUS_INVALID_KEY = 4; //非法密钥。对应数值“4”。
const BMAP_STATUS_INVALID_REQUEST = 5; //非法请求。对应数值“5”。
const BMAP_STATUS_PERMISSION_DENIED = 6; //没有权限。对应数值“6”。(自 1.1 新增)
const BMAP_STATUS_SERVICE_UNAVAILABLE = 7; //服务不可用。对应数值“7”。(自 1.1 新增)
const BMAP_STATUS_TIMEOUT = 8; //超时。对应数值“8”。(自 1.1 新增)
//自动定位
declare const BMapGL: any;

const requireScript = function (url: string) {
  return new Promise((resolve: any) => {
    const $script = document.createElement("script");
    $script.onload = function () {
      resolve();
    };
    $script.src = url;
    document.head.appendChild($script);
  });
};
function showPosition(position: any) {
  const lng = position.coords.longitude;
  const lat = position.coords.latitude;
  getLocationName(lng, lat);
  console.log(`H5定位: lng:${lng},lat:${lat}`);
}
function showError(error: any) {
  locationByBaidu();
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("用户拒绝对获取地理位置的请求。");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("位置信息是不可用的。");
      break;
    case error.TIMEOUT:
      console.log("请求用户地理位置超时。");
      break;
    case error.UNKNOWN_ERROR:
      console.log("未知错误。");
      break;
  }
}
export const watchLocation = function () {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition, showError);
  } else {
    console.log("该浏览器不支持获取地理位置。");
    locationByBaidu();
  }
};
export const getLocation = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.log("该浏览器不支持获取地理位置。");
    locationByBaidu();
  }
};
// lng：经度 lat：纬度
const getLocationName = function (lng: number, lat: number) {
  // 创建地理编码实例
  const myGeo = new BMapGL.Geocoder();
  // 根据坐标得到地址描述
  myGeo.getLocation(new BMapGL.Point(lng, lat), function (result: any) {
    if (result) {
      const detailStore = useDetailStore();
      detailStore.$patch((state) => {
        state.locationName = result.address;
      });
      console.log("定位成功：" + result.address);
    }
  });
};
export default async function locationByBaidu(): Promise<any> {
  const geolocation = new BMapGL.Geolocation();
  geolocation.enableSDKLocation();
  return new Promise((resolve) => {
    geolocation.getCurrentPosition(function (r: any) {
      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        console.log("您的坐标：" + r.point.lng + "," + r.point.lat); // 这是百度坐标
        const lng = r.point.lng;
        const lat = r.point.lat;
        getLocationName(lng, lat);
        resolve({ lat, lng });
      } else {
        console.log("定位失败：" + this.getStatus());
      }
    });
  });
}
