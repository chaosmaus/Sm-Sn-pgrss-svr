$(async function () {
    
    /* OBJECT */
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
            website: 'empty',
            ein: 'empty',
        },
        companyProfile: {
            description: 'empty',
            targetAudience: 'empty',
            competitors: 'empty',
            expansion: false,
            expansionDescription: 'empty',
        },
        captiveInterests: {
            interests: [
                {
                    name: 'empty',
                }
            ],
            focus: {
                firstPartyRisk: false,
                thirdPartyRisk: false,
                both: false,
            }
        },
        marketConditions: {
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
        financialOutlook: {
            grossRevenueActual: 'empty',
            grossRevenueEstimated: 'empty',
            grossRevenueProjected: 'empty',
        },
        coverage: {
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
        },
        risks: {
            riskDetails: [
                {
                    name: 'empty',
                    isCovered: false,
                    frequency: 'empty', //save percentage value
                    severity: 'empty'
                }
            ],
        },
        lossHistory: {
            losses: [
                {
                    date: 'empty',
                    amount: 'empty',
                    description: 'empty'
                }
            ],
            otherLossesFileUpload: false,
        },
        riskManagement: {
            maintainBackups: false,
            storeBackups: false,
            backupStorageService: 'empty'
        },
        documentsRequest: {
            documents: [
                {
                    name: 'empty',
                    canBeProvided: false,
                    description: 'empty',
                }
            ],
        }
    }




    /* AUTH */
    const auth0Client = await auth0.createAuth0Client({
        domain: "login.xn.capital",
        clientId: "NoSXDnJTyhvN9uXGuAbqkCXeEdf15DzV",
        authorizationParams: {
            audience: "https://server.xn.capital"
        },
    });

    const user = await auth0Client.getUser();
    if (user === undefined) {
        // Send the user back to the login page if they are not logged in
        window.location.href = '/login';
    }


    const token = await auth0Client.getTokenSilently();
    console.log(token)
    $.ajax({
        url: `https://server.xn.capital/api/users/profile`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        success: function (response) {
            console.log(response.matchedUser)
            /* CONTACT */
            survey.contact.name = response.matchedUser.user.full_name;
            survey.contact.email = response.matchedUser.user.email;
            survey.contact.phone = response.matchedUser.user.phone_number;
        },
        error: function (xhr, status, error) {
            console.error('User info retrieval failed:', error);
        }
    });


    const extractSurvey = () => {
        //remove non used inputs

        if ($('#First-Party-Risk').siblings('.w-checkbox-input').hasClass('w--redirected-checked')) {
            $('.margin--bottom--40px.third').remove();
        }



        /* PROGRESS */
        survey.progress = Math.round(Number($('#survey-progress').val()));

        /* BUSINESS */
        survey.business.name = $('#CompanyName').val();
        survey.business.address = $('#StreetAddress').val();
        survey.business.website = $('#WebsiteUrl').val();
        survey.business.ein = $('#ein').val();

        /* COMPANY PROFILE */
        survey.companyProfile.description = $('#Business-Description').val();
        survey.companyProfile.targetAudience = $('#targetAudience').val();
        survey.companyProfile.competitors = $('#significantCompetitors').val();
        if ($('.s-business--toggles').find('.w-checkbox-input').eq(0).hasClass('w--redirected-checked')) {
            survey.companyProfile.expansion = true;
        }else{ 
            survey.companyProfile.expansion = false;
        }
        survey.companyProfile.expansionDescription = $('#expansionPlanDescription').val();

        /* CAPTIVE INTERESTS */
        let interests = []
        $('.s-interest-wrapper--grid').eq(0).find('.interest--checkbox').each((index, element) => {
            if ($(element).find('.w-checkbox-input').hasClass('w--redirected-checked')) {
                interests.push(
                    {
                        name: $(element).find('input').attr('data-name')
                    }
                )
            }
        })
        survey.captiveInterests.interests = interests;

        if ($('.s-interest--toggles').find('.w-checkbox-input').eq(0).hasClass('w--redirected-checked')) {
            survey.captiveInterests.focus.firstPartyRisk = true;
            survey.captiveInterests.focus.thirdPartyRisk = false;
            survey.captiveInterests.focus.both = false;
        } else if ($('.s-interest--toggles').find('.w-checkbox-input').eq(1).hasClass('w--redirected-checked')) {
            survey.captiveInterests.focus.firstPartyRisk = false;
            survey.captiveInterests.focus.thirdPartyRisk = true;
            survey.captiveInterests.focus.both = false;
        } else if ($('.s-interest--toggles').find('.w-checkbox-input').eq(2).hasClass('w--redirected-checked')) {
            survey.captiveInterests.focus.firstPartyRisk = false;
            survey.captiveInterests.focus.thirdPartyRisk = false;
            survey.captiveInterests.focus.both = true;
        }

        /* MARKET CONDITIONS */
        survey.marketConditions.companyValuation = $('#Company-Valuation').val();
        survey.marketConditions.numberOfCustomers = $('#Number-of-Customers').val();
        survey.marketConditions.numberOfBigCustomers = $('#customersResponsible').val();
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
        survey.marketConditions.customersResponsible = customersResponsibleData;

        survey.marketConditions.numberOfBigSuppliers = $('#supplierResponsible').val();
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
        survey.marketConditions.suppliersResponsible = suppliersResponsibleData;


        /* FINANCIAL OUTLOOK */
        survey.financialOutlook.grossRevenueActual = $('#Actual-Gross-Revenue').val();
        survey.financialOutlook.grossRevenueEstimated = $('#Estimated-Gross-Revenue').val();
        survey.financialOutlook.grossRevenueProjected = $('#Projected-Gross-Revenue').val();


        /* COVERAGE - CURRENT INSURANCE COVERAGE */
        let basicCoverage = []
        $('.current--insurance--policies--wrapper').eq(0).find('.current--coverage--checkbox').each((index, element) => {
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
        $('.current--insurance--policies--wrapper').eq(2).find('.current--coverage--checkbox').each((index, element) => {
            if ($(element).find('.w-checkbox-input').hasClass('w--redirected-checked')) {
                specialtyCoverage.push(
                    {
                        name: $(element).find('input').eq(0).attr('data-name')
                    }
                )
            }
        })
        survey.coverage.specialtyCoverage = specialtyCoverage;

        /* RISKS */
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

        /* LOSS HISTORY */
        let losses = [];
        $('.s-loss--block').each((index, element) => {
            losses.push(
                {
                    date: $(element).find(`input`).eq(0).val(),
                    lossAmount: $(element).find(`input`).eq(1).val(),
                    lossDescription: $(element).find(`input`).eq(2).val()
                }
            )
        })
        survey.lossHistory.losses = losses;

        /* RISK MANAGEMENT*/
        if ($('.block--9').find('.w-checkbox-input').eq(0).hasClass('w--redirected-checked')) {
            survey.riskManagement.storeBackups = true;
        } else {
            survey.riskManagement.storeBackups = false;
        }

        if ($('.block--9').find('.w-checkbox-input').eq(2).hasClass('w--redirected-checked')) {
            survey.riskManagement.maintainBackups = true;
        } else {
            survey.riskManagement.maintainBackups = false;
        }

        survey.riskManagement.backupStorageService = $('#Backup-Service-Used').val();


        /* DOCUMENTS REQUEST */
        let documents = []
        $('.margin--bottom--40px').each((index, element) => {
            let checked = false;
            if ($(element).find('.w-checkbox-input').eq(0).hasClass('w--redirected-checked')) {
                checked = true;
            } else {
                checked = false;
            }

            documents.push(
                {
                    name: $(element).find(`.document--label`).text(),
                    canBeProvided: checked,
                    description: $(element).find(`input`).eq(3).val()
                }
            )
        })
        survey.documentsRequest.documents = documents;

        console.log(survey)
        sendSurvey()
    }

    const sendSurvey = () => {
        $.ajax({
            url: 'https://server.xn.capital/api/users/save-survey', 
            type: 'POST',
            headers: {
            Authorization: `Bearer ${token}`,            },
            contentType: 'application/json',
            data: JSON.stringify({survey}),
            success: function (response) {
                console.log('Survey submitted successfully:', response);  
            },
            error: function (response) {
                console.error('Submission failed:', response);
            }
        });
    }

    $('.button--save-progress').on('click', ()=>{
        extractSurvey()
    })

    $('.submit').on('click', ()=>{
        extractSurvey()
    })

});
