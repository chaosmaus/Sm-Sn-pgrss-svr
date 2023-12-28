
$(document).ready(function () {
    //on save or submit button, do:
    //define Survey Object
    //Go through each question flow, and save the entire object
    $(function () {

        // Function to log in the user
        let survey =
        {
            progress:'0%',
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
            survey.contact.email = $('#input-username').val();
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
                            annualPremium: $(element).find(`#premiumProperty-Insurance-${index - 1}`).val(),
                            deductableAmount: $(element).find(`#deductibleProperty-Insurance-${index - 1}`).val()
                        }
                    )
                }

            })
            survey.coverage.coverageDetails - coverageDetails;

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
                        annualPremium: $(element).find(`input`).eq(0).val(),
                        deductableAmount: $(element).find(`input`).eq(1).val()
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
                        frequency: $(element).find('input').eq(0).val(),
                        severity: $(element).find('input').eq(1).val(),
                    }
                )

            })
            survey.risks.riskDetails = riskDetails;

            /* RISKS - HORIZONS */
            survey.risks.recentRisksChanges = $('#Recent-Risks-changes').val();
            survey.risks.risksIdentifiedByManagement = $('#Risks-Identified-by-Management-During-The-Process').val();

            //PROGRESS

            survey.progress = localStorage.getItem('progress')


            axios.post('https://www.xncapsrvcs.com/api/cms/survey', { survey })
                .then(response => {
                    console.log('Survey submitted successfully', response);
                    $('.s-popup--heading').text('Survey progress saved!')
                    $('.s-popup--text').text('Redirecting you to your dashboard...')
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 2000);
                })
                .catch(error => {
                    console.error('Error submitting survey', error);
                    $('.s-popup--heading').text('Survey progress saving failed, ')
                    $('.s-popup--text').text('please try again later or contact our support.')
                });
        }


        var authenticationData = {
            Username: 'username',
            Password: 'password',
        };

        function registerUser(email, password) {
            $('.login--error--message').hide();
            $.ajax({
                url: 'https://www.xncapsrvcs.com/api/users/register',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    email: email,
                    password: password
                }),
                success: function (response) {
                    console.log('Registration successful. Please check your email for the code.');
                    // Here you would prompt the user to enter the one-time code
                    $('.register--wrapper').addClass('hidden')
                    $('.confirmation-code--wrapper').removeClass('hidden')
                },
                error: function (xhr, status, error) {
                    $('.login--error--message').text('Registration failed, please check if your password follows the required format');
                    $('.login--error--message').show();
                }
            });
        }

        // Function to confirm user registration
        function confirmRegistration(email, code) {
            $.ajax({
                url: 'https://www.xncapsrvcs.com/api/users/confirm-registration',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    email: email,
                    code: code
                }),
                success: function (response) {
                    console.log('Registration confirmed. You can now log in.');
                    // Here you might automatically log the user in or prompt them to log in
                    $('.register-success--wrapper').removeClass('hidden')
                    $('.confirmation-code--wrapper').addClass('hidden')
                },
                error: function (xhr, status, error) {
                    $('.login--error--message').text('Confirmation failed:', error);
                }
            });
        }
//
        function loginUser(email, password) {
            $('.login--error--message').hide();
            $.ajax({
                url: 'https://www.xncapsrvcs.com/api/users/login',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    email: email,
                    password: password
                }),
                success: function (response) {
                    console.log('Login successful:', response);
                    // Here you would handle the login tokens, perhaps saving them to localStorage

                    localStorage.setItem('accessToken', response.accessToken);
                    localStorage.setItem('refreshToken', response.refreshToken);

                    // window.location.href = '/dashboard';
                    $('.login--section.survey').hide();
                    $('.s-popup--wrapper').css('display', 'flex');
                    extractSurvey();
                   

                },
                error: function (xhr, status, error) {
                    $('.login--error--message').text('Incorrect username or password');
                    $('.login--error--message').show();
                }
            });
        }



        $('#login').on('click', () => {

            authenticationData.Username = $('#input-username').val();
            authenticationData.Password = $('#input-password').val();

            loginUser(authenticationData.Username, authenticationData.Password)

        });

        $('.register--button').on('click', () => {
            $('.login--wrapper').addClass('hidden')
            $('.register--wrapper').removeClass('hidden')
        })

        $('#register').on('click', () => {

            authenticationData.Username = $('#register-username').val();
            authenticationData.Password = $('#register-password').val();

            registerUser(authenticationData.Username, authenticationData.Password)



        });

        $('#confirm').on('click', () => {

            authenticationData.Username = $('#register-username').val();

            confirmRegistration(authenticationData.Username, $('#confirmation-code').val())


        });



        $('#register-success').on('click', () => {

            $('.login--wrapper').removeClass('hidden')
            $('.register-success--wrapper').addClass('hidden')

        });




    });



    $('.button--save-progress').on('click', () => {

        $('.login--section').css('display', 'flex');


    })
});
