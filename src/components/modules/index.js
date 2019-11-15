import zteForm from './zte-form';
import zteTable from './zte-table';
import zteItem from './zte-item';
import zteTableLocal from './zte-table-local';
import UE from './editor';

const zteUI = {
  install(Vue) {
    Vue.component('zteForm', zteForm);
    Vue.component('zteTable', zteTable);
    Vue.component('zteItem', zteItem);
    Vue.component('zteTableLocal', zteTableLocal);
    Vue.component('UE', UE);
  },
};

export default zteUI;
