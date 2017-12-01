$(document).ready(function(){
  $('.delete-article').on('click', function(e) {
    if(!confirm('Are you sure to delete this article?')){
      e.preventDefault();
      return false;
    }
    $target = $(e.target);
    var id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: 'articles/delete/'+id,
    }).done(function() {
      console.log('Deleted');
      window.location.href = '/articles';
    }).fail(function() {
      console.log(err);
    });
  });
});