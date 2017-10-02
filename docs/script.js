<<<<<<< HEAD
// let rest = 'http://markx-168601.appspot.com/';
let rest = 'http://markx.azurewebsites.net//';
=======
let rest = 'http://markx-mysterytony.rhcloud.com/';
// let rest = 'http://localhost:8080/';
>>>>>>> ba7f52d651568b1639ba0b4b775302f6bdd6296c

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
