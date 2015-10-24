var photoPath = 0;
var parm = 0;
var isAndroid;

if (window.androidApi != null) {
    isAndroid = true;
}
else {
    isAndroid = false;
}
//调用GPS
function openGetGps() {
    if (isAndroid) {
        gpsCallBack(window.androidApi.openGetGps());
    }
    else {
        window.location = "js://openGetGps()";
    }
}
//读取通讯录
function readContactList() {
    if (isAndroid) {
        //window.androidApi.readContactList()
        contactCallBack(window.androidApi.readContactList());
    }
    else {
        window.location = "js://readContactList()";
    }
}
//录入联系人
function writeContact() {
    if (isAndroid) {
        a(window.androidApi.writeContact("{\"contactName\":\"阿布\",\"phoneNumber\":\"159357123\",\"email\":\"123@456.com\",\"company\":\"公司\",\"address\":\"地址\"}"
        ));
    }
    else {
        window.location = "js://writeContact()";
    }
}

//修改联系人
function modifyContact() {

    if (isAndroid) {
        c(window.androidApi.modifyContact("{\"contactId\":\"601\",\"contactName\":\"阿布不\",\"phoneNumber\":\"159357456\",\"email\":\"123@654.com\",\"company\":\"公司改\",\"address\":\"地址改\"}"));
    }
    else {
        window.location = "js://modifyContact()";
    }
}
//删除联系人
function deleteContact() {
    if (isAndroid) {
        b(window.androidApi.deleteContact("601"));
    }
    else {
        window.location = "js://deleteContact()";
    }
}
//调摄像头
function openCamera() {
	photoPath = new Date().getTime()+"_"+parm;
	parm++;
    if (isAndroid) {

        window.androidApi.openCamera("data/photo/" + photoPath + ".png");     //android摄像头
    }
    else {
        window.location = "js:TC//openCamera('"+photoPath+".jpeg')";
    }
}
//二维码
function openScan() {
    if (isAndroid) {
        window.androidApi.openScan();     //android摄像头
    }
    else {
        window.location = "js:TC//openScan()";
    }
}


//语音识别
function openVoice() {

    if (isAndroid) {

        window.androidApi.openVoice();     //android摄像头

    }
    else {
        window.location = "js://openVoice()";
    }
}

//数据转发提交（同步）
function submit(url, data, httpType) {

    if (isAndroid) {


        submitCallBack(window.androidApi.submit(url, data, httpType));

    }
    else {
        window.location = "js://submit(" + url + "," + data + "," + httpType + ")";
    }
}

//数据转发提交(异步)
function ajaxSubmit(url, data, httpType) {

    if (isAndroid) {


        window.androidApi.ajaxSubmit(url, data, httpType);

    }
    else {
        window.location = "js://ajaxSubmit(" + url + "," + data + "," + httpType + ")";
    }
}

function encrptyDataAnddeciphering(str) {
    deciphering(str);

    encrptyData(str);
}


//数据解密
function deciphering(str) {

    if (isAndroid) {


        window.androidApi.deciphering(str);

    }
    else {
        window.location = "js://deciphering(str)";
    }
}
//数据加密
function encrptyData(str) {

    if (isAndroid) {


        window.androidApi.encrptyData(str);

    }
    else {
        window.location = "js://deciphering(str)";
    }
}


