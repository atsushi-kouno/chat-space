$(function(){
  function buildHTML(message){
    if ( message.image ) {
      var html =
        `<div class="message" data-message-id=${message.id}>
            <div class="message-upper">
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
            <img src=${message.image} >
          </div>`
      return html;
    } else {
      var html =
        `<div class="message" data-message-id=${message.id}>
            <div class="message-upper">
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
          </div>`
      return html;
      };
    }
  var reloadMessages = function() {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    last_message_id = $('.message:last').data("message-id");
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id},
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        //メッセージが入ったHTMLに、入れ物ごと追加
        $('.chat-main__message-list').append(insertHTML);
        $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert("メッセージ受信に失敗しました");
    });
  };
  
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
      $('#new_message')[0].reset();
      $('.send-btn').prop( 'disabled', false )
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
    
  });
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});