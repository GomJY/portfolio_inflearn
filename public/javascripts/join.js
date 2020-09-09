document.querySelector("#form-join").addEventListener("submit", e => {
  // console.log(e);
  e.preventDefault();
  let $form = $("form#form-join");
  let action = $form.attr('action');
  let data = getFormData($form);
  console.log(data);

  $.ajax({
    url : action,
    type: "POST",
    data : data,
    success: function(data, textStatus, jqXHR)
    {
      alert(data.message);
      if(data.code == 200) {
        window.location = location.origin;
      }
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
      console.log(data);
    }
});
} );

function getFormData($form){
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function(n, i){
      indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}