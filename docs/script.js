// let rest = 'http://markx-168601.appspot.com/';
let rest = 'http://markx.azurewebsites.net/';

$(document).ready(() => {
  $('#demo-input').on('input propertychange', () => {
    $.ajax({
      url: rest,
      method: 'POST',
      data: {
        mxbody: $('#demo-input').val()
      },
      success: (res) => {
        $('#demo-output').html(res.htmlbody);
      },
      error: (res) => {
        $('#demo-output').html(res.responseText);
      },
      dataType: 'json',
    });
  });
})
