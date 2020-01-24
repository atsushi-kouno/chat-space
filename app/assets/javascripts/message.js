$(function(){

    function buildHTML(message){
      if ( message.image ) {
        var html =
          `<div class="message-upper">
              <div class="message-upper__talker">
                ${message.user_name}
              </div>
              <div class="message-upper__day">
                ${message.created_at}
              </div>
            </div>
            <div class="message-talk">
              ${message.content}
            </div>
            <img src=${message.image} >`
        return html;
      } else {
        var html =
          `<div class="message-upper">
              <div class="message-upper__talker">
                ${message.user_name}
              </div>
              <div class="message-upper__day">
                ${message.created_at}
              </div>
            </div>
            <div class="message-talk">
              ${message.content}
            </div>`
        return html;
      };
    }
    $('#new_message').on('submit', function(e){
    e.preventDefault()
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,  //同期通信でいう『パス』
      type: 'POST',  //同期通信でいう『HTTPメソッド』
      data: formData,  
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat-main__message-list').append(html);
      $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      $('.new_message')[0].reset();
      $('.send-btn').prop( 'disabled', false )
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
  });
});