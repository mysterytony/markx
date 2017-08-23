let rest = 'http://markx-mysterytony.rhcloud.com/';
// let rest = 'http://localhost:8080/';

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
