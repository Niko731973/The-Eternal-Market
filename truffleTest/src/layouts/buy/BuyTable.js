import React, {Component} from 'react';
//import './datatables.css';

const $ = require('jquery');
$.DataTable = require('datatables.net');


//seller, title, description, price, timeListed, enabled, successes, aborted, disputed
const columns = [
    {
        title: 'Title',
        data: 'title'
    },
    {
        title: 'Price',
        data: 'price'
    },
    {
        title: 'successes',
        data: 'successes'
    }
];

function reloadTableData(names) {
    const table = $('.data-table-wrapper').find('table').DataTable();
    table.clear();
    table.rows.add(names);
    table.draw();
}

function updateTable(names) {
    const table = $('.data-table-wrapper').find('table').DataTable();
    let dataChanged = false;
    table.rows().every(function () {
        const oldNameData = this.data();
        const newNameData = names.find((nameData) => {
            return nameData.name === oldNameData.name;
        });
        if (oldNameData.nickname !== newNameData.nickname) {
            dataChanged = true;
            this.data(newNameData);
        }
       return true;
    });

    if (dataChanged) {
        table.draw();
    }
}


class BuyTable extends Component {
    componentDidMount() {
        $(this.refs.main).DataTable({
            dom: '<"data-table-wrapper"t>',
            data: this.props.names,
            columns,
            ordering: false
        });
    }

    componentWillUnmount(){
       $('.data-table-wrapper').find('table').DataTable().destroy(true);
    }

    shouldComponentUpdate(nextProps) {
    
        if (nextProps.names.length !== this.props.names.length) {
            reloadTableData(nextProps.names);
        } else {
            updateTable(nextProps.names);
        }
        return false;
    }



    render() {
        return (
            <div>
                <table ref="main" width ="90%"/>
            </div>);
    }
}

BuyTable.PropTypes = {
    names: React.PropTypes.array
};

export default BuyTable;