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
        domain: "login.xncaptive.com",
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
    let previousSurvey;
    console.log(token)
    $.ajax({
        url: `https://server.xn.capital/api/users/profile`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        success: function (response) {
            //console.log(response.matchedUser)
            /* CONTACT */
            savedSurvey = response.matchedUser.user.survey_answers;
            survey.contact.name = response.matchedUser.user.full_name;
            survey.contact.email = response.matchedUser.user.email;
            survey.contact.phone = response.matchedUser.user.phone_number;
            loadSurvey(savedSurvey)
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
        survey.companyProfile.targetAudience = $('#Target-Audience').val();
        survey.companyProfile.competitors = $('#Significant-Competitors').val();
        if ($('.s-business--toggles').find('.w-checkbox-input').eq(0).hasClass('w--redirected-checked')) {
            survey.companyProfile.expansion = true;
        } else {
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
        $('.current--insurance--policies--wrapper').eq(1).find('.current--coverage--checkbox').each((index, element) => {
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


    function loadSurvey(savedSurvey) {
        if (savedSurvey) {
            //savedSurvey = JSON.parse(savedSurvey);
            console.log(savedSurvey)
            console.log('starting load')


            /* BUSINESS */
            $('#CompanyName').val(savedSurvey.business.name);
            $('#StreetAddress').val(savedSurvey.business.address);
            $('#WebsiteUrl').val(savedSurvey.business.website);
            $('#ein').val(savedSurvey.business.ein);

            /* COMPANY PROFILE */
            $('#Business-Description').val(savedSurvey.companyProfile.description);
            $('#Target-Audience').val(savedSurvey.companyProfile.targetAudience);
            $('#Significant-Competitors').val(savedSurvey.companyProfile.competitors);
            if (savedSurvey.companyProfile.expansion) {
                $('.s-business--toggles').find('.w-checkbox-input').eq(0).trigger('click')
            } else {
                $('.s-business--toggles').find('.w-checkbox-input').eq(1).trigger('click')
            }
            $('#expansionPlanDescription').val(savedSurvey.companyProfile.expansionDescription);


            /* CAPTIVE INTERESTS */
            if (savedSurvey.captiveInterests.focus.firstPartyRisk) {
                $('.s-interest--toggles').find('.w-checkbox-input').eq(0).trigger('click')
            } else if (savedSurvey.captiveInterests.focus.thirdPartyRisk) {
                $('.s-interest--toggles').find('.w-checkbox-input').eq(0).trigger('click')
            } else if (savedSurvey.captiveInterests.focus.both) {
                $('.s-interest--toggles').find('.w-checkbox-input').eq(0).trigger('click')
            }

            savedSurvey.captiveInterests.interests.forEach((element, index) => {
                setTimeout(() => {
                    $(`[data-name="${element.name}"]`).trigger('click')
                }, 500);
            });

            /* MARKET CONDITIONS */
            $('#Company-Valuation').val(savedSurvey.marketConditions.companyValuation);
            $('#Number-of-Customers').val(savedSurvey.marketConditions.numberOfCustomers);
            $('#customersResponsible').val(savedSurvey.marketConditions.numberOfBigCustomers);
            $('#customersResponsible').trigger('input')
            savedSurvey.marketConditions.customersResponsible.forEach((element, index) => {
                $(`#customer--name--${index}`).val(element.name)
                $(`#customer--revenue--${index}`).val(element.revenueResponsibility)
            });
            $('#supplierResponsible').val(savedSurvey.marketConditions.numberOfBigSuppliers);
            $('#supplierResponsible').trigger('input')
            savedSurvey.marketConditions.suppliersResponsible.forEach((element, index) => {
                $(`#supplier--name--${index}`).val(element.name)
                $(`#supplier--revenue--${index}`).val(element.revenueResponsibility)
            });


            /* FINANCIAL OUTLOOK */
            $('#Actual-Gross-Revenue').val(savedSurvey.financialOutlook.grossRevenueActual);
            $('#Estimated-Gross-Revenue').val(savedSurvey.financialOutlook.grossRevenueEstimated);
            $('#Projected-Gross-Revenue').val(savedSurvey.financialOutlook.grossRevenueProjected);

            /* COVERAGE - CURRENT INSURANCE COVERAGE */

            savedSurvey.coverage.basicCoverage.forEach((element, index) => {
                $(`[data-name="${element.name}"]`).trigger('click')
            });
            savedSurvey.coverage.specialtyCoverage.forEach((element, index) => {
                $(`[data-name="${element.name}"]`).trigger('click')
            });



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

            /* LOSS HISTORY */

            savedSurvey.lossHistory.losses.forEach((element, index) => {
                $('.loss--button').trigger('click')
            });
            $('.s-loss--block').eq(0).remove()
            savedSurvey.lossHistory.losses.forEach((element, index) => {
                $('.s-loss--block').eq(index).find('input').eq(0).val(element.date);
                $('.s-loss--block').eq(index).find('input').eq(1).val(element.lossAmount)
                $('.s-loss--block').eq(index).find('input').eq(2).val(element.lossDescription)
            });

            /* RISK MANAGEMENT */

            if (savedSurvey.riskManagement.storeBackups) {
                $('.s-risk-management--toggles').eq(0).find('.w-checkbox-input').eq(0).trigger('click')
            } else {
                $('.s-risk-management--toggles').eq(0).find('.w-checkbox-input').eq(1).trigger('click')
            }

            if (savedSurvey.riskManagement.maintainBackups) {
                $('.s-risk-management--toggles').eq(1).find('.w-checkbox-input').eq(0).trigger('click')
            } else {
                $('.s-risk-management--toggles').eq(1).find('.w-checkbox-input').eq(1).trigger('click')
            }

            $('#Backup-Service-Used').val(savedSurvey.riskManagement.backupStorageService);

            
            /* DOCUMENT REQUESTS */

            savedSurvey.documentsRequest.documents.forEach(function(element) {
                var $wrapper = $(".document--label").filter(function() {
                    return $(this).text().trim() === element.name;
                }).closest('.basic-wrapper');
        
                $wrapper.find('input').eq(2).val(element.description);
                if (element.canBeProvided) {
                    $wrapper.find('.w-checkbox-input').eq(0).trigger('click')
                } else {
                    $wrapper.find('.w-checkbox-input').eq(1).trigger('click')
                }
            });

        }
    }



    const sendSurvey = () => {
        $.ajax({
            url: 'https://server.xn.capital/api/users/save-survey',
            type: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            contentType: 'application/json',
            data: JSON.stringify({ survey }),
            success: function (response) {
                console.log('Survey submitted successfully:', response);
            },
            error: function (response) {
                console.error('Submission failed:', response);
            }
        });
    }

    $('.button--save-progress').on('click', () => {
        extractSurvey()
    })

    $(document).on('click', '.submit', function () {
        extractSurvey();
    });

});
