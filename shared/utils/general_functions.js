/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable no-path-concat */
/* jslint node: true */
/* jshint -W097 */
/* jshint esversion: 6 */

const EmailValidator = require('email-deep-validator');
const { cpf, cnpj } = require('cpf-cnpj-validator');

module.exports = {
  isNumeric: function (informedValue) {
    if (!informedValue) {
      return false;
    }

    if (!isNaN(informedValue)) {
      return true;
    } else {
      return false;
    }
  },

  isEmail: async function (informedEmail, timeout, verifyDomain, verifyMailbox) {
    if (!informedEmail) {
      return false;
    }

    let _timeout = timeout || 10000;
    let _verifyDomain = verifyDomain || true;
    let _verifyMailbox = verifyMailbox || false;

    const emailValidator = new EmailValidator();
    emailValidator.options = { timeout: _timeout, verifyDomain: _verifyDomain, verifyMailbox: _verifyMailbox };

    return { wellFormed, validDomain, validMailbox } = await emailValidator.verify(informedEmail);
  },

  isEmailDeep: async function (informedEmail, timeout, verifyDomain, verifyMailbox) {
    if (!informedEmail) {
      return false;
    }

    let _timeout = timeout || 30000;
    let _verifyDomain = verifyDomain || true;
    let _verifyMailbox = verifyMailbox || true;

    const emailValidator = new EmailValidator();
    emailValidator.options = { timeout: _timeout, verifyDomain: _verifyDomain, verifyMailbox: _verifyMailbox };

    return { wellFormed, validDomain, validMailbox } = await emailValidator.verify(informedEmail);
  },

  isCPF: function (informedCPF) {
    if (!informedCPF) {
      return false;
    }

    return cpf.isValid(informedCPF);
  },

  isCNPJ: function (informedCNPJ) {
    if (!informedCNPJ) {
      return false;
    }

    return cnpj.isValid(informedCNPJ);
  },

  formatCPF: function (informedCPF) {
    return cpf.format(informedCPF);
  },

  formatCNPJ: function (informedCNPJ) {
    return cnpj.format(informedCNPJ);
  },

  generateCPF: function () {
    return cpf.generate();
  },

  generateCNPJ: function () {
    return cnpj.generate();
  },

  stripCPF: function (informedCPF) {
    if (!informedCPF) {
      return false;
    }

    return cpf.strip(informedCPF);
  },

  stripCNPJ: function (informedCNPJ) {
    if (!informedCNPJ) {
      return false;
    }

    return cnpj.strip(informedCNPJ);
  }

};