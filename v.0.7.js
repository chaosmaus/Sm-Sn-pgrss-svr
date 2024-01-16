
$(document).ready(function () {
    //on save or submit button, do:
    //define Survey Object
    //Go through each question flow, and save the entire object
    $(function () {

        // Function to log in the user
        let survey =
        {
            progress: '0%',
            contact: {
                name: 'empty',
                email: 'empty',
                phone: 'empty'
            },
            business: {
                name: 'empty',
                address: 'empty',
                website: 'empty'
            },
            exposure: {
                payroll: {
                    annualPayroll: 'empty',
                    numberOfEmployees: 'empty',
                    grossRevenueCurrentYear: 'empty',
                    grossRevenueNextYear: 'empty',
                    fileUpload: false
                },
                customersAndSupplies: {
                    companyValuation: 'empty',
                    numberOfCustomers: 'empty',
                    numberOfBigCustomers: 'empty',
                    customersResponsible: [
                        {
                            name: 'empty',
                            revenueResponsibility: 'empty'
                        }
                    ],
                    numberOfBigSuppliers: 'empty',
                    suppliersResponsible: [
                        {
                            name: 'empty',
                            revenueResponsibility: 'empty'
                        }
                    ],
                },
                financialStatementFileUpload: false,
                licensingRegulation: {
                    regulatoryAgencies: 'empty',
                    operationLicenses: 'empty',
                }

            },
            coverage: {
                annualPremiumTotal: 'empty',
                basicCoverage: [
                    {
                        name: 'empty' //the name is the Id
                    }
                ],
                specialtyCoverage: [
                    {
                        name: 'empty'
                    }
                ],
                coverageDetails: [
                    {
                        name: 'empty',
                        annualPremium: 'empty',
                        deductableAmount: 'empty'
                    }
                ],
                policiesApplicationFileUpload: false,
                currentInsurancePolicyFileUpload: false,
            },
            lossHistory: {
                lossRunsFileUpload: false,
                otherLosses: [
                    {
                        date: 'empty',
                        amount: 'empty',
                        description: 'empty'
                    }
                ],
                otherLossesFileUpload: false,
                lossPreventionMeasures: 'empty',
                lossPreventionMeasuresFileUpload: false,
            },
            risks: {
                risks: [
                    {
                        name: 'empty'
                    }
                ],
                otherRisks: 'empty',
                riskDetails: [
                    {
                        name: 'empty',
                        isCovered: false,
                        frequency: 'empty', //save percentage value
                        severity: 'empty'
                    }
                ],
                recentRisksChanges: 'empty',
                risksIdentifiedByManagement: 'empty',

            }
        }


        const extractSurvey = () => {
            /* CONTACT */
            survey.contact.name = $('#name').val();
            survey.contact.email = $('#email').val();
            survey.contact.phone = $('#phone').val();

            /* BUSINESS */
            survey.business.name = $('#CompanyName').val();
            survey.business.address = $('#StreetAddress').val();
            survey.business.website = $('#WebsiteUrl').val();

            /* EXPOSURE - PAYROLL */
            survey.exposure.payroll.annualPayroll = $('#payrollTotal').val();
            survey.exposure.payroll.numberOfEmployees = $('#employeeEst').val();
            survey.exposure.payroll.grossRevenueCurrentYear = $('#revenueEstimate').val();
            survey.exposure.payroll.grossRevenueNextYear = $('#revenueProjected').val();
            if ($('.block--4').find('.w-checkbox-input').eq(0).hasClass('w--redirected-checked')) {
                survey.exposure.payroll.fileUpload = true;
            } else {
                survey.exposure.payroll.fileUpload = false;
            }

            /* EXPOSURE - CUSTOMERS & SUPPLIERS */
            survey.exposure.customersAndSupplies.companyValuation = $('#companyValuation').val();
            survey.exposure.customersAndSupplies.numberOfCustomers = $('#customersNumber').val();
            survey.exposure.customersAndSupplies.numberOfBigCustomers = $('#customersResponsible').val();
            let customersResponsibleData = []
            if ($('.s-field--row--wrapper--customer').length > 0) {
                $('.s-field--row--wrapper--customer').each((index, element) => {
                    customersResponsibleData.push(
                        {
                            name: $(`#customer--name--${index}`).val(),
                            revenueResponsibility: $(`#customer--revenue--${index}`).val()
                        }
                    )
                })
            }
            survey.exposure.customersAndSupplies.customersResponsible = customersResponsibleData;
            survey.exposure.customersAndSupplies.numberOfBigSuppliers = $('#SupplierResponsible').val();
            let suppliersResponsibleData = []
            if ($('.s-field--row--wrapper--supplier').length > 0) {
                $('.s-field--row--wrapper--supplier').each((index, element) => {
                    suppliersResponsibleData.push(
                        {
                            name: $(`#supplier--name--${index}`).val(),
                            revenueResponsibility: $(`#supplier--revenue--${index}`).val()
                        }
                    )
                })
            }
            survey.exposure.customersAndSupplies.suppliersResponsible = suppliersResponsibleData;

            /* EXPOSURE - FINANCIAL STATEMENT */
            if ($('.block--6').find('.w-checkbox-input').eq(0).hasClass('w--redirected-checked')) {
                survey.exposure.financialStatementFileUpload = true;
            } else {
                survey.exposure.financialStatementFileUpload = false;
            }

            /* EXPOSURE - LICENSING & REGULATION */
            survey.exposure.licensingRegulation.regulatoryAgencies = $('#Regulatory-agencies-impacting-business').val();
            survey.exposure.licensingRegulation.operationLicenses = $('#License-to-operate').val();

            /* COVERAGE - CURRENT INSURANCE COVERAGE */
            survey.coverage.annualPremiumTotal = $('#currentAnnualPremiumTotal').val();
            let basicCoverage = []
            $('.policies-wrapper--grid').eq(0).find('.s-policies--checkbox').each((index, element) => {
                if ($(element).find('.w-checkbox-input').hasClass('w--redirected-checked')) {
                    basicCoverage.push(
                        {
                            name: $(element).find('input').attr('data-name')
                        }
                    )
                }
            })

            survey.coverage.basicCoverage = basicCoverage;
            let specialtyCoverage = []
            $('.policies-wrapper--grid').eq(1).find('.s-policies--checkbox').each((index, element) => {
                if ($(element).find('.w-checkbox-input').hasClass('w--redirected-checked')) {
                    specialtyCoverage.push(
                        {
                            name: $(element).find('input').eq(0).attr('data-name')
                        }
                    )
                }
            })
            survey.coverage.specialtyCoverage = specialtyCoverage;

            /* COVERAGE - COVERAGE DETAILS */
            let coverageDetails = [];
            $('.policies--input--row').each((index, element) => {
                if (index !== 0) { // IMPORTANT -> there is a hidden row as a reference HTML, so remember this on auto complete
                    coverageDetails.push(
                        {
                            name: $(element).find('.policy--label').text(),
                            annualPremium: $(element).find(`input`).eq(0).val(),
                            deductableAmount: $(element).find(`input`).eq(1).val(),
                        }
                    )
                }

            })
            survey.coverage.coverageDetails = coverageDetails;

            /* COVERAGE - INSURANCE APPLICATIONS & POLICIES */
            if ($('.block--10').find('.w-checkbox-input').eq(0).hasClass('w--redirected-checked')) {
                survey.coverage.policiesApplicationFileUpload = true;
            } else {
                survey.coverage.policiesApplicationFileUpload = false;
            }
            if ($('.block--10').find('.w-checkbox-input').eq(1).hasClass('w--redirected-checked')) {
                survey.coverage.currentInsurancePolicyFileUpload = true;
            } else {
                survey.coverage.currentInsurancePolicyFileUpload = false;
            }
            /* LOSS HISTORY */
            if ($('.block--11').find('.w-checkbox-input').eq(0).hasClass('w--redirected-checked')) {
                survey.lossHistory.lossRunsFileUpload = true;
            } else {
                survey.lossHistory.lossRunsFileUpload = false;
            }
            let otherLosses = [];
            $('.loss-history--row').each((index, element) => {
                otherLosses.push(
                    {
                        date: $(element).find(`input`).eq(0).val(),
                        lossAmount: $(element).find(`input`).eq(1).val(),
                        lossDescription: $(element).find(`input`).eq(2).val()
                    }
                )
            })
            survey.coverage.otherLosses = otherLosses;

            if ($('.block--11').find('.w-checkbox-input').eq(0).hasClass('w--redirected-checked')) {
                survey.lossHistory.otherLossesFileUpload = true;
            } else {
                survey.lossHistory.otherLossesFileUpload = false;
            }

            /* LOSS HISTORY - LOSS PREVENTION MEASURES */
            survey.lossHistory.lossPreventionMeasures = $('#Loss-Preventive-Measures').val();
            if ($('.block--12').find('.w-checkbox-input').eq(0).hasClass('w--redirected-checked')) {
                survey.lossHistory.lossPreventionMeasuresFileUpload = true;
            } else {
                survey.lossHistory.lossPreventionMeasuresFileUpload = false;
            }

            /* RISKS */

            let risks = []

            $('.risks-wrapper--grid').eq(0).find('.s-risks--checkbox').each((index, element) => {
                if ($(element).find('.w-checkbox-input').hasClass('w--redirected-checked')) {
                    risks.push(
                        {
                            name: $(element).find('input').attr('data-name')
                        }
                    )
                }
            })
            survey.risks.risks = risks;
            survey.risks.otherRisks = $('#Other-Risks').val();

            /* RISKS - SLIDER */
            let riskDetails = [];
            $('.risks--block').each((index, element) => {
                if (index !== 0) {
                    let checked = false;
                    if ($(element).find('.w-checkbox-input').eq(0).hasClass('w--redirected-checked')) {
                        checked = true;
                    } else {
                        checked = false;
                    }

                    riskDetails.push(
                        {
                            name: $(element).find('.risk-block--label').text(),
                            isCovered: checked,
                            frequency: $(element).find('.s-percentage--input').eq(0).val(),
                            severity: $(element).find('.s-percentage--input').eq(1).val(),
                        }
                    )
                }
            })
            survey.risks.riskDetails = riskDetails;

            /* RISKS - HORIZONS */
            survey.risks.recentRisksChanges = $('#Recent-Risks-changes').val();
            survey.risks.risksIdentifiedByManagement = $('#Risks-Identified-by-Management-During-The-Process').val();

            //PROGRESS

            survey.progress = localStorage.getItem('progress')


            localStorage.setItem('surveyJSON', JSON.stringify(survey))
        }


        function loadSurvey() {
            let savedSurvey = localStorage.getItem('surveyJSON')
            if (savedSurvey) {
                savedSurvey = JSON.parse(savedSurvey);
                console.log(savedSurvey)
                let progress = '0%'
                let fullName = survey.contact.name
                let firstName = fullName.split(' ')[0];
                console.log('starting load')


                /* CONTACT */
                $('#name').trigger('input')
                $('#name').val(savedSurvey.contact.name)
                $('#email').val(savedSurvey.contact.email);
                $('#phone').val(savedSurvey.contact.phone);
                $('.error-bubble').addClass('hidden')
                /* BUSINESS */
                $('#CompanyName').val(savedSurvey.business.name);
                $('#StreetAddress').val(savedSurvey.business.address);
                $('#WebsiteUrl').val(savedSurvey.business.website);
                /* EXPOSURE - PAYROLL */
                $('#payrollTotal').val(savedSurvey.exposure.payroll.annualPayroll);
                $('#employeeEst').val(savedSurvey.exposure.payroll.numberOfEmployees);
                $('#revenueEstimate').val(savedSurvey.exposure.payroll.grossRevenueCurrentYear);
                $('#revenueProjected').val(savedSurvey.exposure.payroll.grossRevenueNextYear);
                if (savedSurvey.exposure.payroll.fileUpload) {
                    $('.block--4').find('.w-checkbox-input').eq(0).trigger('click')
                }
                /* EXPOSURE - CUSTOMERS & SUPPLIERS */
                $('#companyValuation').val(savedSurvey.exposure.customersAndSupplies.companyValuation);
                $('#customersNumber').val(savedSurvey.exposure.customersAndSupplies.numberOfCustomers);
                $('#customersResponsible').val(savedSurvey.exposure.customersAndSupplies.numberOfBigCustomers);
                $('#customersResponsible').trigger('input')
                savedSurvey.exposure.customersAndSupplies.customersResponsible.forEach((element, index) => {
                    $(`#customer--name--${index}`).val(element.name)
                    $(`#customer--revenue--${index}`).val(element.revenueResponsibility)
                });
                $('#SupplierResponsible').val(savedSurvey.exposure.customersAndSupplies.numberOfBigSuppliers);
                $('#SupplierResponsible').trigger('input')
                savedSurvey.exposure.customersAndSupplies.suppliersResponsible.forEach((element, index) => {
                    $(`#supplier--name--${index}`).val(element.name)
                    $(`#supplier--revenue--${index}`).val(element.revenueResponsibility)
                });
                /* EXPOSURE - FINANCIAL STATEMENT */
                if (savedSurvey.exposure.financialStatementFileUpload) {
                    $('.block--6').find('.w-checkbox-input').eq(0).trigger('click')
                }
                /* EXPOSURE - LICENSING & REGULATION */
                $('#Regulatory-agencies-impacting-business').val(savedSurvey.exposure.licensingRegulation.regulatoryAgencies);
                $('#License-to-operate').val(savedSurvey.exposure.licensingRegulation.operationLicenses);
                /* COVERAGE - CURRENT INSURANCE COVERAGE */
                //NEED TO WAIT FOR STATE?NOPE, LOAD WHENEVER BUTTON IS CLICKED!
                $('#currentAnnualPremiumTotal').val(savedSurvey.coverage.annualPremiumTotal);
                savedSurvey.coverage.basicCoverage.forEach((element, index) => {
                    $(`[data-name="${element.name}"]`).trigger('click')
                });
                savedSurvey.coverage.specialtyCoverage.forEach((element, index) => {
                    $(`[data-name="${element.name}"]`).trigger('click')
                });



                /* COVERAGE - COVERAGE DETAILS */
                $('.next').on('click', () => {
                    savedSurvey.coverage.coverageDetails.forEach((element, index) => {
                        console.log('coverage details', element)
                        $(`.policy--label:contains("${element.name}")`)
                            .siblings('.policy--inputs-wrapper').find('.s-field--text').eq(0)
                            .val(element.annualPremium);

                        $(`.policy--label:contains("${element.name}")`)
                            .siblings('.policy--inputs-wrapper').find('.s-field--text').eq(1)
                            .val(element.deductableAmount)
                    });
                })

                /* COVERAGE - INSURANCE APPLICATIONS & POLICIES */
                if (savedSurvey.coverage.policiesApplicationFileUpload) {
                    $('.block--10').find('.w-checkbox-input').eq(0).trigger('click')
                }
                if (savedSurvey.coverage.currentInsurancePolicyFileUpload) {
                    $('.block--10').find('.w-checkbox-input').eq(1).trigger('click')
                }
                /* LOSS HISTORY */
                if (savedSurvey.lossHistory.lossRunsFileUpload) {
                    $('.block--11').find('.w-checkbox-input').eq(0).trigger('click')
                }

                for (let i = 0; i < savedSurvey.coverage.otherLosses.length - 1; i++) {
                    $('.plus--icon').trigger('click')
                }

                savedSurvey.coverage.otherLosses.forEach((element, index) => {
                    $('.loss-history--row').eq(index).find('input').eq(0).val(element.date)
                    $('.loss-history--row').eq(index).find('input').eq(1).val(element.lossAmount)
                    $('.loss-history--row').eq(index).find('input').eq(2).val(element.lossDescription)
                });

                if (savedSurvey.lossHistory.otherLossesFileUpload) {
                    $('.block--11').find('.w-checkbox-input').eq(1).trigger('click')
                }
                /* LOSS HISTORY - LOSS PREVENTION MEASURES */
                $('#Loss-Preventive-Measures').val(savedSurvey.lossHistory.lossPreventionMeasures);
                if (savedSurvey.lossHistory.lossPreventionMeasuresFileUpload) {
                    $('.block--12').find('.w-checkbox-input').eq(0).trigger('click')
                }

                savedSurvey.risks.risks.forEach((element, index) => {
                    $(`[data-name="${element.name}"]`).trigger('click')

                });

                $('#Other-Risks').val(savedSurvey.risks.otherRisks)

                /* RISKS - SLIDER */
                $('.next').on('click', () => {
                    savedSurvey.risks.riskDetails.forEach((element, index) => {
                        if (element.isCovered) {
                            $(`.risk-block--label:contains("${element.name}")`)
                                .siblings('.risk-block--upload--wrapper').find('.w-checkbox-input').trigger('click')
                        }
                        $(`.risk-block--label:contains("${element.name}")`)
                            .parent().siblings('.risk--sliders--wrapper').find('input').eq(0).val(element.frequency);

                        $(`.risk-block--label:contains("${element.name}")`)
                            .parent().siblings('.risk--sliders--wrapper').find('input').eq(0).val(element.severity);

                        // sliders decoration
                        $(`.risk-block--label:contains("${element.name}")`)
                            .parent().siblings('.risk--sliders--wrapper')
                            .find('.s-slider--progress--button').eq(0).css('left', element.frequency);

                        $(`.risk-block--label:contains("${element.name}")`)
                            .parent().siblings('.risk--sliders--wrapper')
                            .find('.s-slider--progress').eq(0).css('width', element.frequency);

                        $(`.risk-block--label:contains("${element.name}")`)
                            .parent().siblings('.risk--sliders--wrapper')
                            .find('.s-slider--progress--button').eq(1).css('left', element.severity);

                        $(`.risk-block--label:contains("${element.name}")`)
                            .parent().siblings('.risk--sliders--wrapper')
                            .find('.s-slider--progress').eq(1).css('width', element.severity);

                    });
                })
                setTimeout(() => {
                    $('.s-popup--wrapper').css('display', 'none');
                }, 1500);










            }
        }





        loadSurvey()

        $('#logout--button').on('click', () => {
        })

        $('.button--save-progress').on('click', () => {

            //window.location.href = '/login';
            extractSurvey();

        })


    });


});
