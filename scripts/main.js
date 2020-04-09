'use strict';

class Table {
  constructor({ rowsCount, colsCount }) {
    this.rowsCount = rowsCount;
    this.colsCount = colsCount;
    this.boxSize = 50;
    this.wrapper = document.createElement('div');
    this.table = document.createElement('table');
    this.addRowButton = document.createElement('button');
    this.addColumnButton = document.createElement('button');
    this.deleteRowButton = document.createElement('button');
    this.deleteColumnButton = document.createElement('button');

    this.state = {
      activeRowIndex: 0,
      activeColumnIndex: 0,
    };
  }

  createWrapper() {
    this.wrapper.classList.add('wrapper');
    document.body.append(this.wrapper);
  }

  createTable() {
    this.table.classList.add('wrapper__table');
    this.wrapper.append(this.table);
    this.table.createTHead();
    this.table.createTBody();
    this.createRows();
    this.createCols();
  }

  getTbody() {
    return this.table.querySelector('tbody');
  };

  createRows() {
    for (let i = 0; i < this.rowsCount; i++) {
      this.table.insertRow();
    }
  };

  getAllRows() {
    return [...this.table.rows];
  };

  createCols() {
    this.getAllRows().forEach((tr) => {
      for (let i = 0; i < this.colsCount; i++) {
        tr.insertCell(0);
      }
    });
  };

  setStylesToAddRowButton() {
    this.addRowButton.className = `
    button wrapper__button wrapper__button--add plus-row`;
    this.addRowButton.textContent = '+';
    this.wrapper.append(this.addRowButton);
  };

  setStylesToAddColumnButton() {
    this.addColumnButton.className = `
    button wrapper__button wrapper__button--add plus-column`;
    this.addColumnButton.textContent = '+';
    this.wrapper.append(this.addColumnButton);
  };

  setStylesToDeleteRowButton() {
    this.deleteRowButton.className = `
    button wrapper__button wrapper__button--minus minus-row`;
    this.deleteRowButton.textContent = '-';
    this.wrapper.append(this.deleteRowButton);
  };

  setStylesToDeleteColumnButton() {
    this.deleteColumnButton.className = `
    button wrapper__button wrapper__button--minus minus-column`;
    this.deleteColumnButton.textContent = '-';
    this.wrapper.append(this.deleteColumnButton);
  };

  addRow() {
    const clonedRow = this.getTbody().querySelector('tr').cloneNode(true);

    this.getTbody().append(clonedRow);
  };

  addColumn() {
    this.getAllRows().forEach((tr) => {
      const cell = document.createElement('td');

      tr.append(cell);
    });
  };

  setActiveRowIndex(rowIndex) {
    this.state.activeRowIndex = rowIndex;
  }

  setActiveColumnIndex(cellIndex) {
    this.state.activeColumnIndex = cellIndex;
  }

  deleteButtonMovingX() {
    this.deleteColumnButton.style.transform = `
    translateX(${(this.state.activeColumnIndex) * this.boxSize + 2}px)`;
  };

  deleteButtonMovingY() {
    this.deleteRowButton.style.transform = `translateY(${
      -(this.getAllRows().length * this.boxSize) // all table height, minus moves forward
       + (this.state.activeRowIndex * this.boxSize)}px)`;
  };

  hideDeleteButtons() {
    this.deleteRowButton.classList.add('hidden');
    this.deleteColumnButton.classList.add('hidden');
  }

  shouldDeleteRowButtonBeShow() {
    if (this.getAllRows().length > 1) {
      this.deleteRowButton.classList.remove('hidden');
    }
  }

  shouldDeleteColumnButtonBeShow() {
    const isOneColumn = this.getAllRows().every((tr) => {
      return tr.querySelectorAll('td').length === 1;
    })

    if (!isOneColumn) {
      this.deleteColumnButton.classList.remove('hidden');
    }
  }

  showDeleteButtons() {
    this.shouldDeleteRowButtonBeShow();
    this.shouldDeleteColumnButtonBeShow();
  }

  deleteColumn() {
    this.getAllRows().map((col) => {
      const needToDelete = col.children[this.state.activeColumnIndex];

      col.removeChild(needToDelete);
    });

  };

  deleteRow() {
    const needToDelete = this.getAllRows()[this.state.activeRowIndex];

    needToDelete.parentNode.removeChild(needToDelete);
    this.deleteButtonMovingY();
  };

  moveDeleteColumnButton(tagName, cellIndex) {
    if (tagName === 'TD' && cellIndex !== this.state.activeColumnIndex) {
      this.setActiveColumnIndex(cellIndex);
      this.deleteButtonMovingX();
    }
  }

  moveDeleteRowButton(tagName, rowIndex) {
    if (tagName === 'TR' && rowIndex !== this.state.activeRowIndex) {
      this.setActiveRowIndex(rowIndex);
      this.deleteButtonMovingY();
    }
  }

  addEventListenerToTable() {
    this.table.addEventListener(
      'mousemove', (e) => {
        const { target } = e;
        const { tagName, cellIndex, parentNode } = target;
        const { rowIndex } = parentNode;

        this.moveDeleteColumnButton(tagName, cellIndex);
        this.moveDeleteRowButton(parentNode.tagName, rowIndex);
      }
    );
  }

  showButtonsOnTableHover() {
    this.table.addEventListener(
      'mouseenter',
      () => this.showDeleteButtons()
    );
  }

  setDeleteRowButtonDefault() {
    this.wrapper.addEventListener(
      'mouseenter',
      () => {
        if(this.state.activeRowIndex === 0 ) {
          this.deleteRowButton.style.transform = `translateY(${ // set DeleteRowButton in front of the first table row
          -(this.getAllRows().length * this.boxSize)}px)`; // full table height
       }
      }
    );
  }

  hideButtonsOnWrapperLeave() {
    this.wrapper.addEventListener(
      'mouseleave',
      () => this.hideDeleteButtons()
    );
  }

  addEventListenersToButtons() {
    this.addRowButton.addEventListener(
      'click', () => this.addRow()
    );

    this.addColumnButton.addEventListener(
      'click', () => this.addColumn()
    );

    this.deleteRowButton.addEventListener(
      'click', () => {
        this.deleteRow();
        this.hideDeleteButtons();
      }
    );

    this.deleteColumnButton.addEventListener(
      'click', () => {
        this.deleteColumn();
        this.hideDeleteButtons();
      }
    );
  }

  render() {
    this.createWrapper();
    this.createTable();
    this.setStylesToAddRowButton();
    this.setStylesToAddColumnButton();
    this.setStylesToDeleteRowButton();
    this.setStylesToDeleteColumnButton();
    this.addEventListenersToButtons();
    this.addEventListenerToTable();
    this.showButtonsOnTableHover();
    this.hideButtonsOnWrapperLeave();
    this.setDeleteRowButtonDefault();
  }
}

const myApp = new Table(
  {
    rowsCount: 4, colsCount: 4,
  }
);

myApp.render();

const myApp2 = new Table(
  {
    rowsCount: 3, colsCount: 3,
  }
);

myApp2.render();
