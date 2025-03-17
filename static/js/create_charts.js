var l_ctx = document.getElementById('l_side').getContext('2d');
var r_ctx = document.getElementById('r_side').getContext('2d');

let ec_val = 0.0 //3.6
let efi_val = 0.0 //4.6
let ev_val = 0.0 //5.6
let ec_val_2 = 0.0 //3.6
let efi_val_2 = 0.0 //4.6
let ev_val_2 = 0.0 //5.6

var data = {
  labels: ['o', 'o', 'o', 'o', 'o'],
  datasets: [{
    label: 'Sample 1',
    data: [0,0,0,0,0],
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 0,
    fill: false
  }]
};

var r_config = {
  type: 'line',
  data: data,
  options: {
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false
        },
        ticks: {
          display: false // Hide x-axis labels
        }
      },
      y: {
        beginAtZero: true,
        reverse: true,
        grid: {
          display: false
        },
        position: 'right'
      }
    },
    plugins: {
      legend: {
        display: false
      },
      annotation: {
        annotations: {
          base: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            borderColor: 'rgb(0,0,0)',
            borderWidth: 4,
            label: {
              content: 'Vacuum level',
              enabled: true,
              position: 'start',
              useHTML: true
            }
          },
          Ec: {
            type: 'line',
            yMin: ec_val,
            yMax: ec_val,
            borderColor: 'blue',
            borderWidth: 2,
            label: {
              content: 'E_c',
              enabled: true,
              position: 'start',
              useHTML: true
            }
          },
          Efi: {
            type: 'line',
            yMin: efi_val,
            yMax: efi_val,
            borderColor: 'blue',
            borderWidth: 2,
            label: {
              content: 'E_{fi}',
              enabled: true,
              position: 'start',
              useHTML: true
            }
          },
          Ev: {
            type: 'line',
            yMin: ev_val,
            yMax: ev_val,
            borderColor: 'blue',
            borderWidth: 2,
            label: {
              content: 'E_v',
              enabled: true,
              position: 'start',
              useHTML: true
            }
          },
          base_ec: {
            type: 'line',
            xMin: 1, // April
            xMax: 1,
            yMin: 0,
            yMax: ec_val,
            borderColor: 'green',
            borderWidth: 2,
            label: {
              content: ec_val,
              enabled: true,
              position: 'center'
            }
          },
          ec_efi: {
            type: 'line',
            xMin: 2, // April
            xMax: 2,
            yMin: ec_val,
            yMax: efi_val,
            borderColor: 'green',
            borderWidth: 2,
            label: {
              content: efi_val - ec_val,
              enabled: true,
              position: 'center'
            }
          },
          ec_ev: {
            type: 'line',
            xMin: 3, // April
            xMax: 3,
            yMin: ec_val,
            yMax: ec_val,
            borderColor: 'green',
            borderWidth: 2,
            label: {
              content: ec_val - ec_val,
              enabled: true,
              position: 'center'
            }
          }
        }
      }
    }
  }
};

const l_config = {
  type: 'line',
  data: data,
  options: {
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false
        },
        ticks: {
          display: false // Hide x-axis labels
        }
      },
      y: {
        beginAtZero: true,
        reverse: true,
        grid: {
          display: false
        },
        position: 'left'
      }
    },
    plugins: {
      legend: {
        display: false
      },
      annotation: {
        annotations: {
          base: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            borderColor: 'rgb(0,0,0)',
            borderWidth: 4,
            label: {
              content: 'Vacuum level',
              enabled: true,
              position: 'end',
              useHTML: true
            }
          },
          Ec: {
            type: 'line',
            yMin: ec_val_2,
            yMax: ec_val_2,
            borderColor: 'blue',
            borderWidth: 2,
            label: {
              content: 'E_c',
              enabled: true,
              position: 'end',
              useHTML: true
            }
          },
          Efi: {
            type: 'line',
            yMin: efi_val_2,
            yMax: efi_val_2,
            borderColor: 'blue',
            borderWidth: 2,
            label: {
              content: 'E_{fi}',
              enabled: true,
              position: 'end',
              useHTML: true
            }
          },
          Ev: {
            type: 'line',
            yMin: ev_val_2,
            yMax: ev_val_2,
            borderColor: 'blue',
            borderWidth: 2,
            label: {
              content: 'E_v',
              enabled: true,
              position: 'end',
              useHTML: true
            }
          },
          base_ec: {
            type: 'line',
            xMin: 1, // April
            xMax: 1,
            yMin: 0,
            yMax: ec_val_2,
            borderColor: 'green',
            borderWidth: 2,
            label: {
              content: ec_val_2,
              enabled: true,
              position: 'center'
            }
          },
          ec_efi: {
            type: 'line',
            xMin: 2, // April
            xMax: 2,
            yMin: ec_val_2,
            yMax: efi_val_2,
            borderColor: 'green',
            borderWidth: 2,
            label: {
              content: efi_val_2 - ec_val,
              enabled: true,
              position: 'center'
            }
          },
          ec_ev: {
            type: 'line',
            xMin: 3, // April
            xMax: 3,
            yMin: ec_val_2,
            yMax: ev_val_2,
            borderColor: 'green',
            borderWidth: 2,
            label: {
              content: ec_val_2 - ec_val_2,
              enabled: true,
              position: 'center'
            }
          }
        }
      }
    }
  }
};

const l_chart = new Chart(l_ctx, l_config);
const r_chart = new Chart(r_ctx, r_config);

$(document).ready(function(){
  $('input[type="radio"]').change(function(){
    if ($('#btn_t').is(':checked')) {
      $('#v_tem').prop('disabled', false);
      $('#v_con').prop('disabled', true);
      $('#v_dop').prop('disabled', true);
      $('#l_side_div').prop('hidden', true);
    } else if ($('#btn_c').is(':checked')) {
      $('#v_tem').prop('disabled', false);
      $('#v_con').prop('disabled', false);
      $('#v_dop').prop('disabled', true);
      $('#l_side_div').prop('hidden', false);
    } else if ($('#btn_d').is(':checked')) {
      $('#v_tem').prop('disabled', false);
      $('#v_con').prop('disabled', false);
      $('#v_dop').prop('disabled', false);
      $('#l_side_div').prop('hidden', false);
    }
  });


  $('#run').on('click', function(){
    $.ajax({
      url: '/',
      type: 'POST',
      data: JSON.stringify({
        'T': $('#v_tem').val(),
        'C': $('#v_con').val(),
        'D': $('#v_dop').val()
      }),
      headers: {
        'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
      },
      contentType: 'application/json; charset=utf-8',
      dataType: "json",
      success: function (data, status, xhr) {
        G_ec_val = data['G_Ec'];
        G_efi_val = data['G_Efi'];
        G_ev_val = data['G_Ev'];
        G_eg_val = data['G_Eg'];
        G_nc_electron = data['G_Nc_electron'];
        G_nc_hole = data['G_Nc_hole'];
        G_ni_electron = data['G_Ni_electron'];

        A_ec_val = data['A_Ec'];
        A_efi_val = data['A_Efi'];
        A_ev_val = data['A_Ev'];
        A_eg_val = data['A_Eg'];
        A_nc_electron = data['A_Nc_electron'];
        A_nc_hole = data['A_Nc_hole'];
        A_ni_electron = data['A_Ni_electron'];

        // ec_val_2 = data['Ec2'];
        // efi_val_2 = data['Efi2'];
        // ev_val_2 = data['Ev2'];
        rann = r_chart.options.plugins.annotation.annotations
        edit_annotation(rann, G_ec_val, G_efi_val, G_ev_val)
        lann = l_chart.options.plugins.annotation.annotations
        edit_annotation(lann, A_ec_val, A_efi_val, A_ev_val)
        l_chart.update();
        r_chart.update();
        $('#G_span_Ev').text(Math.round(G_ev_val * 1000) / 1000)
        $('#G_span_Ec').text(Math.round(G_ec_val * 1000) / 1000)
        $('#G_span_Efi').text(Math.round(G_efi_val * 1000) / 1000)
        $('#G_span_Eg').text(Math.round(G_eg_val * 1000) / 1000)
        $('#G_nc_electron').text(G_nc_electron)
        $('#G_nc_hole').text(G_nc_hole)
        $('#G_ni_electron').text(G_ni_electron)

        $('#A_span_Ev').text(Math.round(A_ev_val * 1000) / 1000)
        $('#A_span_Ec').text(Math.round(A_ec_val * 1000) / 1000)
        $('#A_span_Efi').text(Math.round(A_efi_val * 1000) / 1000)
        $('#A_span_Eg').text(Math.round(A_eg_val * 1000) / 1000)
        $('#A_nc_electron').text(A_nc_electron)
        $('#A_nc_hole').text(A_nc_hole)
        $('#A_ni_electron').text(A_ni_electron)
      },
      error: function (jqXhr, textStatus, errorMessage) {
        $('p').append('Error' + errorMessage);
      }
    })
  });
});

function edit_annotation(ann, ec, efi, ev){
  ann.Ec.yMin = ec
  ann.Ec.yMax = ec
  ann.Efi.yMin = efi + ec
  ann.Efi.yMax = efi + ec
  ann.Ev.yMin = ev
  ann.Ev.yMax = ev
  ann.base_ec.yMax = ec
  ann.base_ec.label.content = Math.abs(ec).toFixed(3)
  ann.ec_efi.yMin = ec
  ann.ec_efi.yMax = efi + ec
  ann.ec_efi.label.content = Math.abs(efi).toFixed(3)
  ann.ec_ev.yMin = ec
  ann.ec_ev.yMax = ev
  ann.ec_ev.label.content = Math.abs(ev - ec).toFixed(3)
}
