export function timeConverter(UNIX_timestamp){
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
}

export function timestampToDateTime(timestamp){
    let dt = new Date(timestamp*1000);
    let hr = dt.getHours();
    let m = "0" + dt.getMinutes();
    let s = "0" + dt.getSeconds();

    dt.setHours(hr);
    dt.setMinutes(m);
    dt.setSeconds(s);

    return dt;
}