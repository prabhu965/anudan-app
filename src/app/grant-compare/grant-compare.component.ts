import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Grant, GrantDiff, SectionDiff, AttributeDiff } from './../model/dahsboard';
import { Component, Input, OnInit, Inject } from '@angular/core';
import * as deepDiff from 'deep-object-diff';
import * as inf from 'indian-number-format';

@Component({
  selector: 'app-grant-compare',
  templateUrl: './grant-compare.component.html',
  styleUrls: ['./grant-compare.component.scss']
})
export class GrantCompareComponent implements OnInit {

  @Input("newGrant") newGrant: Grant;
  @Input("oldGrant") oldGrant: Grant;
  changes: any[] = [];
  grantDiff: GrantDiff;

  constructor(public dialogRef: MatDialogRef<GrantCompareComponent>
    , @Inject(MAT_DIALOG_DATA) public grantsToCompare: Grant[]) {
    this.newGrant = grantsToCompare[0];
    this.oldGrant = grantsToCompare[1];
    debugger;
    const difference = deepDiff.detailedDiff(this.oldGrant, this.newGrant);
    console.log(difference);
  }

  ngOnInit() {
    this._diff(this.newGrant, this.oldGrant);
  }

  _diff(newGrant: any, oldGrant: any): any[] {
    const resultHeader = [];
    const resultSections = [];

    if (oldGrant.name !== newGrant.name) {
      this._getGrantDiff();
      resultHeader.push({ 'order': 1, 'category': 'Grant Header', 'name': 'Grant Name changed', 'change': [{ 'old': oldGrant.name, 'new': newGrant.name }] });
      this.grantDiff.oldGrantName = oldGrant.name;
      this.grantDiff.newGrantName = newGrant.name;
    }
    if (oldGrant.startDate !== newGrant.startDate) {
      this._getGrantDiff();
      //resultHeader.push({'order':1,'category':'Grant Header','name':'Grant Start Date changed','change':[{'old': oldGrant.stDate,'new':newGrant.stDate}]});
      this.grantDiff.oldGrantStartDate = oldGrant.startDate;
      this.grantDiff.newGrantStartDate = newGrant.startDate;
    }
    if (oldGrant.endDate !== newGrant.endDate) {
      //resultHeader.push({'order':1,'category':'Grant Header','name':'Grant End Date changed','change':[{'old': oldGrant.enDate,'new':newGrant.enDate}]});
      this._getGrantDiff();
      this.grantDiff.oldGrantEndDate = oldGrant.endDate;
      this.grantDiff.newGrantEndDate = newGrant.endDate;
    }
    if (oldGrant.amount !== newGrant.amount) {
      //resultHeader.push({'order':1,'category':'Grant Header','name':'Grant End Date changed','change':[{'old': oldGrant.enDate,'new':newGrant.enDate}]});
      this._getGrantDiff();
      this.grantDiff.oldGrantAmount = oldGrant.amount;
      this.grantDiff.newGrantAmount = newGrant.amount;
    }
    if (oldGrant.implementingOrganizationName && newGrant.implementingOrganizationName) {
      if (oldGrant.implementingOrganizationName !== newGrant.implementingOrganizationName) {
        //resultHeader.push({'order':1,'category':'Grant Header','name':'Grantee changed','change':[{'old': oldGrant.organization.name,'new':newGrant.organization.name}]});
        this._getGrantDiff();
        this.grantDiff.oldGrantee = oldGrant.implementingOrganizationName;
        this.grantDiff.newGrantee = newGrant.implementingOrganizationName;
      }
    } else if (oldGrant.implementingOrganizationName === '' && newGrant.implementingOrganizationName != '') {
      this._getGrantDiff();
      //resultHeader.push({'order':1,'category':'Grant Header','name':'Grantee added','change':[{'old': '','new':newGrant.organization.name}]});
      this.grantDiff.newGrantee = newGrant.implementingOrganizationName;
    } else if (oldGrant.implementingOrganizationName != '' && newGrant.implementingOrganizationName === '') {
      //resultHeader.push({'order':1,'category':'Grant Header','name':'Grantee removed','change':[{'old': oldGrant.organization.name,'new':''}]});
      this._getGrantDiff();
      this.grantDiff.oldGrantee = oldGrant.implementingOrganizationName;
    }
    if (oldGrant.implementingOrganizationRepresentative !== newGrant.implementingOrganizationRepresentative) {
      //resultHeader.push({'order':1,'category':'Grant Header','name':'Grantee Representative changed','change':[{'old': oldGrant.representative,'new':newGrant.representative}]});
      this._getGrantDiff();
      this.grantDiff.oldRep = oldGrant.implementingOrganizationRepresentative;
      this.grantDiff.newRep = newGrant.implementingOrganizationRepresentative;
    }


    for (const section of newGrant.sections) {
      const oldSection = oldGrant.sections.filter((sec) => sec.name === section.name)[0];
      if (oldSection) {

        if (section.attributes) {
          for (let attr of section.attributes) {
            let oldAttr = null;
            if (oldSection.attributes) {
              oldAttr = oldSection.attributes.filter((a) => a.name === attr.name)[0];
            }
            if (oldAttr) {
              if (oldAttr.name !== attr.name) {
                this._getGrantDiffSections();
                this.saveDifferences(oldSection, oldAttr, section, attr);

              }
              else if (oldAttr.type !== attr.type) {
                this._getGrantDiffSections();
                this.saveDifferences(oldSection, oldAttr, section, attr);

              } else
                if (oldAttr.type === attr.type && oldAttr.type === 'multiline' && oldAttr.value !== attr.value) {
                  this._getGrantDiffSections();
                  this.saveDifferences(oldSection, oldAttr, section, attr);
                } else

                  if (oldAttr.type === attr.type && oldAttr.type === 'kpi') {
                    const ot = (oldAttr.target === undefined || oldAttr.target === null) ? null : oldAttr.target;
                    const nt = (attr.target === undefined || attr.target === null) ? null : attr.target;
                    const of = (oldAttr.frequency === undefined || oldAttr.frequency === null) ? null : oldAttr.frequency;
                    const nf = (attr.frequency === undefined || attr.frequency === null) ? null : attr.frequency;
                    if (ot !== nt) {
                      this._getGrantDiffSections();
                      this.saveDifferences(oldSection, oldAttr, section, attr);
                    } else if (of !== nf) {
                      this._getGrantDiffSections();
                      this.saveDifferences(oldSection, oldAttr, section, attr);
                    }


                  } else
                    if (oldAttr.type === attr.type && oldAttr.type === 'table') {
                      if (oldAttr.tableValue.length !== attr.tableValue.length) {
                        this._getGrantDiffSections();
                        this.saveDifferences(oldSection, oldAttr, section, attr);
                      } else {
                        for (let i = 0; i < oldAttr.tableValue.length; i++) {
                          if (oldAttr.tableValue[i].header !== attr.tableValue[i].header || oldAttr.tableValue[i].name !== attr.tableValue[i].name || oldAttr.tableValue[i].columns.length !== attr.tableValue[i].columns.length) {
                            this._getGrantDiffSections();
                            this.saveDifferences(oldSection, oldAttr, section, attr);
                          } else {
                            for (let j = 0; j < oldAttr.tableValue[i].columns.length; j++) {
                              if (oldAttr.tableValue[i].columns[j].name !== attr.tableValue[i].columns[j].name || oldAttr.tableValue[i].columns[j].value !== attr.tableValue[i].columns[j].value) {
                                this._getGrantDiffSections();
                                this.saveDifferences(oldSection, oldAttr, section, attr);
                              }
                            }
                          }
                        }
                      }

                    } else
                      if (oldAttr.type === attr.type && oldAttr.type === 'document') {
                        if (oldAttr.attachments && attr.attachments && oldAttr.attachments.length !== attr.attachments.length) {
                          this._getGrantDiffSections();
                          this.saveDifferences(oldSection, oldAttr, section, attr);
                        } else if (oldAttr.attachments && attr.attachments && oldAttr.attachments.length === attr.attachments.length) {
                          for (let i = 0; i < oldAttr.attachments.length; i++) {
                            if (oldAttr.attachments[i].name !== attr.attachments[i].name || oldAttr.attachments[i].type !== attr.attachments[i].type) {
                              this._getGrantDiffSections();
                              this.saveDifferences(oldSection, oldAttr, section, attr);
                              break;
                            }
                          }
                        }

                      } else
                        if (oldAttr.type === attr.type && oldAttr.type === 'disbursement') {

                          let hasDifferences = false;

                          if (oldAttr.tableValue.length !== attr.tableValue.length) {
                            hasDifferences = true;
                          } else {
                            for (let i = 0; i < oldAttr.tableValue.length; i++) {

                              if (oldAttr.tableValue[i].columns.length !== attr.tableValue[i].columns.length) {
                                hasDifferences = true;
                              } else {
                                for (let j = 0; j < oldAttr.tableValue[i].columns.length; j++) {
                                  if (oldAttr.tableValue[i].columns[j].name !== attr.tableValue[i].columns[j].name) {
                                    hasDifferences = true;
                                  }
                                  if (((!oldAttr.tableValue[i].columns[j].value || oldAttr.tableValue[i].columns[j].value === null) ? "" : oldAttr.tableValue[i].columns[j].value) !== ((!attr.tableValue[i].columns[j].value || attr.tableValue[i].columns[j].value === null) ? "" : attr.tableValue[i].columns[j].value)) {
                                    hasDifferences = true;
                                  }
                                }
                              }
                            }
                          }

                          if (hasDifferences) {
                            this._getGrantDiffSections();
                            this.saveDifferences(oldSection, oldAttr, section, attr);
                          }

                        }
            } else if (!oldAttr) {
              this._getGrantDiffSections();
              const attrDiff = new AttributeDiff();
              attrDiff.section = section.name;
              attrDiff.newAttribute = attr;
              const sectionDiff = new SectionDiff();
              sectionDiff.oldSection = oldSection;
              sectionDiff.newSection = section;
              sectionDiff.attributesDiffs = [];
              sectionDiff.order = section.order
              sectionDiff.attributesDiffs.push(attrDiff);
              this.grantDiff.sectionDiffs.push(sectionDiff);
            }
          }

          if (oldSection.attributes) {
            for (let attr of oldSection.attributes) {
              let oldAttr = null;

              oldAttr = section.attributes.filter((a) => a.id === attr.id)[0];
              if (!oldAttr) {
                this._getGrantDiffSections();
                const attrDiff = new AttributeDiff();
                attrDiff.section = section.name;
                attrDiff.oldAttribute = attr;
                attrDiff.newAttribute = null;
                const sectionDiff = new SectionDiff();
                sectionDiff.oldSection = oldSection;
                sectionDiff.newSection = section;
                sectionDiff.order = section.order
                sectionDiff.attributesDiffs = [];
                sectionDiff.attributesDiffs.push(attrDiff);
                this.grantDiff.sectionDiffs.push(sectionDiff);
              }
            }
          }
        }
        if (oldSection.name !== section.name) {
          this._getGrantDiffSections();
          //resultSections.push({'order':2,'category':'Grant Details','name':'Section name changed','change':[{'old': section.sectionName,'new':currentSection.sectionName}]});
          let secDiff = new SectionDiff();
          secDiff.oldSection = oldSection;
          secDiff.newSection = section;
          secDiff.order = section.order
          secDiff.hasSectionLevelChanges = true;
          this.grantDiff.sectionDiffs.push(secDiff);
        }
      } else {
        //resultSections.push({'order':2,'category':'Grant Details','name':'Section deleted','change':[{'old': section.sectionName,'new':''}]});
        this._getGrantDiffSections();
        let secDiff = new SectionDiff();
        secDiff.oldSection = null;
        secDiff.newSection = section;
        secDiff.order = section.order;
        secDiff.hasSectionLevelChanges = true;
        this.grantDiff.sectionDiffs.push(secDiff);
      }
    }

    for (const section of oldGrant.sections) {
      const currentSection = newGrant.sections.filter((sec) => sec.name === section.name)[0];
      if (!currentSection) {
        //resultSections.push({'order':2,'category':'Grant Details','name':'New section created','change':[{'old': '','new':section.sectionName}]});
        this._getGrantDiffSections();
        let secDiff = new SectionDiff();
        secDiff.oldSection = section;
        secDiff.newSection = null;
        secDiff.order = section.order;
        secDiff.hasSectionLevelChanges = true
        this.grantDiff.sectionDiffs.push(secDiff);
      }
    }

    this.changes.push(resultHeader);
    this.changes.push(resultSections);
    if (this.grantDiff && this.grantDiff.sectionDiffs) {
      this.grantDiff.sectionDiffs.sort((a, b) => a.order >= b.order ? 1 : -1);
    }
    console.log(this.grantDiff);
    return this.changes;
  }

  _getGrantDiff() {
    if (!this.grantDiff) {
      this.grantDiff = new GrantDiff();
    }
  }
  _getGrantDiffSections() {
    this._getGrantDiff();
    if (!this.grantDiff.sectionDiffs) {
      this.grantDiff.sectionDiffs = [];
    }

  }
  saveDifferences(oldSection, oldAttr, section, attr) {
    const attrDiff = new AttributeDiff();
    attrDiff.section = section.name;
    attrDiff.oldAttribute = oldAttr;
    attrDiff.newAttribute = attr;
    const sectionDiff = new SectionDiff();
    sectionDiff.oldSection = oldSection;
    sectionDiff.newSection = section;
    sectionDiff.attributesDiffs = [];
    sectionDiff.order = section.order
    sectionDiff.attributesDiffs.push(attrDiff);
    this.grantDiff.sectionDiffs.push(sectionDiff);
  }

  getType(type: String) {
    if (type === 'multiline') {
      return 'Descriptive';
    } else if (type === 'table') {
      return 'Tabular';
    } else if (type === 'document') {
      return 'Document';
    } else if (type === 'kpi') {
      return 'Measurement/KPI';
    }
  }

  getTabularData(data) {
    let html = '<table width="100%" border="1"><tr>';
    const tabData = data;
    html += '<td>' + (tabData[0].header ? tabData[0].header : '') + '</td>';
    for (let i = 0; i < tabData[0].columns.length; i++) {


      //if(tabData[0].columns[i].name.trim() !== ''){
      html += '<td>' + String(tabData[0].columns[i].name.trim() === '' ? '&nbsp;' : tabData[0].columns[i].name) + '</td>';
      //}
    }
    html += '</tr>';
    for (let i = 0; i < tabData.length; i++) {

      html += '<tr><td>' + tabData[i].name + '</td>';
      for (let j = 0; j < tabData[i].columns.length; j++) {
        //if(tabData[i].columns[j].name.trim() !== ''){
        html += '<td>' + String(tabData[i].columns[j].value.trim() === '' ? '&nbsp;' : tabData[i].columns[j].value) + '</td>';
        //}
      }
      html += '</tr>';
    }

    html += '</table>'
    //document.getElementById('attribute_' + elemId).innerHTML = '';
    //document.getElementById('attribute_' + elemId).append('<H1>Hello</H1>');
    return html;
  }

  getDisbursementTabularData(data) {
    let html = '<table width="100%" border="1"><tr>';
    const tabData = data;
    html += '<td>' + (tabData[0].header ? tabData[0].header : '') + '</td>';
    for (let i = 0; i < tabData[0].columns.length; i++) {


      //if(tabData[0].columns[i].name.trim() !== ''){
      html += '<td>' + tabData[0].columns[i].name + '</td>';
      //}
    }
    html += '</tr>';
    for (let i = 0; i < tabData.length; i++) {

      html += '<tr><td>' + tabData[i].name + '</td>';
      for (let j = 0; j < tabData[i].columns.length; j++) {
        //if(tabData[i].columns[j].name.trim() !== ''){
        if (!tabData[i].columns[j].dataType) {
          html += '<td>' + tabData[i].columns[j].value + '</td>';
        } else if (tabData[i].columns[j].dataType === 'currency') {
          html += '<td class="text-right">₹ ' + inf.format(Number(tabData[i].columns[j].value), 2) + '</td>';
        }


        //}
      }
      html += '</tr>';
    }

    html += '</table>'
    //document.getElementById('attribute_' + elemId).innerHTML = '';
    //document.getElementById('attribute_' + elemId).append('<H1>Hello</H1>');
    return html;
  }


  getDocumentName(val: string): any[] {
    let obj;
    if (val !== "") {
      obj = JSON.parse(val);
    }
    return obj;
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
