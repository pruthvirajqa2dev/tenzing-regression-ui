import test, { expect, Page, TestInfo } from "@playwright/test";
import LoginPage from "../../pages/LoginPage";
import ENV from "../../config/env";
import expectedTexts from "../../data/expectedTexts.json";
import paths from "../../data/paths.json";
import { getCredentials } from "../../utils/credentials";
import AdminHomePage from "../../pages/AdminHomePage";
import path from "path";
// import { ExcelHandler } from "../../utils/ExcelHandlers";
import * as XLSX from "xlsx";
import fs from "fs";

const tenzing_email: string = ENV.TENZING_EMAIL ?? "";

async function login(page: Page, testInfo: TestInfo) {
    const loginPage = new LoginPage(page, testInfo);
    const homepage: AdminHomePage = await loginPage.login(
        getCredentials(tenzing_email),
        testInfo
    );

    return homepage;
}
test.describe("Regression " + `${process.env.test_env}`.toUpperCase(), () => {
    //Test case 1
    test("Login and Logout  ", async ({ page }, testInfo) => {
        //Login
        var loginPage = new LoginPage(page, testInfo);
        await loginPage.navigateTo("/");
        await expect(page).toHaveTitle(expectedTexts.defaultPageTitle);
        await loginPage.expectPageElementsVisibilityOnLoad();
        //Login
        const homepage =
            await test.step(`Login using Tenzing Email`, async () => {
                return await login(page, testInfo);
            });
        await expect(page).toHaveTitle(expectedTexts.adminLoginPageTitle);
        //Logout
        // await homepage.clickButtonUsingRole("☰");
        loginPage = await test.step(`Logout from Application`, async () => {
            return await homepage.clickSignOutBtn(testInfo);
        });
        await loginPage.expectPageElementsVisibilityOnLoad();
    });
    test("Community - Pay Scales - Add, View, Hide, Unhide, Delete ", async ({
        page
    }, testInfo) => {
        //Login
        var loginPage = new LoginPage(page, testInfo);
        await loginPage.navigateTo("/");
        await expect(page).toHaveTitle(expectedTexts.defaultPageTitle);
        await loginPage.expectPageElementsVisibilityOnLoad();
        //Login
        const homepage =
            await test.step(`Login using Tenzing Email`, async () => {
                return await login(page, testInfo);
            });
        await expect(page).toHaveTitle(expectedTexts.adminLoginPageTitle);

        const communityPage =
            await test.step(`Navigate to Commyunity - Pay Scales`, async () => {
                return await homepage.navigateToCommunityPage(testInfo);
            });
        await communityPage.clickPayScalesLink();
        await communityPage.clickAddNewPayScaleBtn();
        //Add Pay Scales Dialog
        //Verifying Header and Start Text
        await communityPage.verifyDialogHeaderText(
            expectedTexts.addPayScalesDialogHeader
        );

        await communityPage.verifyDialogStartText(
            expectedTexts.mountainBgTextForAddPayScalesDialogPart1,
            expectedTexts.mountainBgTextForAddPayScalesDialogPart2
        );
        //Filling Name and Description
        const inputName = "Test Pay Scale on " + new Date().getTime();
        const inputDescr =
            "This is test pay scale description " + new Date().getTime();
        await communityPage.fillNameInput(inputName);
        await communityPage.fillDescrInput(inputDescr);
        await communityPage.clickDialogNextBtn();
        //Uploading
        //Verifying Header and Start Text
        await communityPage.verifyDialogHeaderText(
            expectedTexts.uploadingPayScalesDialogHeader
        );

        await communityPage.verifyDialogStartText(
            expectedTexts.mountainBgTextForUploadingPayScalesDialogPart1,
            expectedTexts.mountainBgTextForUploadingPayScalesDialogPart2
        );
        const filePath = path.resolve(paths.payscalesPath);
        await page
            .locator(communityPage.fileUploadInputLocator)
            .setInputFiles(filePath);

        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
            header: 1
        }) as string[][];

        //Skip first row (header)
        const dataRows = jsonData.slice(1).filter((row) => row.length > 0);
        console.log("Data Rows from Excel:", dataRows); // Log data rows

        //Done: Need to add verification for file uploaded successfully

        const leftColumnValues = dataRows.map((row) => row[0]);

        const rightColumnValues = dataRows.map((row) => row[1]);

        //Limit to first 12 values for comparison
        const leftColumnSample = leftColumnValues.slice(0, 12);
        const rightColumnSample = rightColumnValues.slice(0, 12);
        console.log("Left Column Sample:", leftColumnSample);
        console.log("Right Column Sample:", rightColumnSample);
        //Logging all left column values from UI grid
        const actualLeftColumn = await communityPage.logAllLeftColumnValues();
        //Logging all right column values from UI grid
        const actualRightColumn = await communityPage.logAllRightColumnValues();

        //Remove pound sign from values for comparison
        // Clean actual UI data
        const actualCleaned = actualRightColumn.map((v) =>
            Number(v.replace(/[£,]/g, "").trim())
        );

        // Ensure same type for both sides
        const expectedCleaned = rightColumnSample.map(Number);

        console.log("Actual Cleaned:", actualCleaned);
        console.log("Expected Cleaned:", expectedCleaned);

        expect(actualCleaned.slice(0, 12)).toEqual(
            expectedCleaned.slice(0, 12)
        );

        //Done: Check the start text at preview upload dialog
        await communityPage.verifyDialogStartText(
            expectedTexts.mountainBgTextForPreviewUploadPayScalesDialogPart1,
            expectedTexts.mountainBgTextForPreviewUploadPayScalesDialogPart2
        );

        //Save
        console.log("Save");
        await communityPage.clickDialogSaveBtn();
        await expect(
            page.getByText(expectedTexts.payScaleSuccessMsg)
        ).toBeVisible();

        await page.waitForLoadState("load");

        //Verify tile created with expected header
        console.log("Verify tile created with expected header");

        await communityPage.expectElementToHaveText(
            communityPage.getCardHeaderTitleLocator(inputName),
            inputName
        );
        await communityPage.expectElementToHaveText(
            communityPage.getCardContentLocator(inputDescr),
            inputDescr
        );

        //View Pay Scale Points
        console.log("View Pay Scale Points");
        const addedCard = page
            .locator(communityPage.cardLocator)
            .filter({ hasText: inputName });
        await addedCard.locator(communityPage.viewBtnLocator).click();
        await communityPage.verifyDialogHeaderText(
            expectedTexts.viewPayScaleDialogHeaderPart + inputName
        );

        // Close View Dialog
        console.log("Close View Dialog");
        const viewDialog = page.locator(communityPage.dialogLocator);
        await viewDialog
            .locator(communityPage.primaryBtnLocator)
            .filter({ hasText: expectedTexts.closeBtnText })
            .click();
        //Verify date
        const formattedDate = new Date().toLocaleDateString("en-GB");
        const expectedDateText = "Date Added: " + formattedDate;
        console.log("expectedDateText: " + expectedDateText);
        const dateText = await addedCard
            .locator(communityPage.dateLabelLocator)
            .textContent();
        console.log("Date Text from UI: " + dateText);
        expect(dateText?.trim()).toContain(expectedDateText);

        //Hide Dialog
        console.log("Hide Dialog");
        await addedCard.locator(communityPage.archiveBtnLocator).click();

        //Verify card not visible after archive
        console.log("Verify card not visible after archive");
        await expect(
            page.locator(communityPage.getCardHeaderTitleLocator(inputName))
        ).not.toBeVisible();
        await expect(
            page.locator(communityPage.getCardContentLocator(inputDescr))
        ).not.toBeVisible();
        await expect(
            page.getByText(expectedTexts.payScaleHiddenMsg)
        ).toBeVisible();

        //Toggle Show Hidden
        console.log("Toggle Show Hidden ON");
        await communityPage.toggleShowHidden();
        await communityPage.expectElementToHaveText(
            communityPage.getCardHeaderTitleLocator(inputName),
            inputName
        );
        await communityPage.expectElementToHaveText(
            communityPage.getCardContentLocator(inputDescr),
            inputDescr
        );
        //Unhide Pay Scale
        console.log("Unhide Pay Scale");
        await addedCard.locator(communityPage.unarchiveBtnLocator).click();
        //Verify card not visible after unarchive
        console.log("Verify card not visible after unarchive");
        await expect(
            page.locator(communityPage.getCardHeaderTitleLocator(inputName))
        ).not.toBeVisible();
        await expect(
            page.locator(communityPage.getCardContentLocator(inputDescr))
        ).not.toBeVisible();
        await expect(
            page.getByText(expectedTexts.payScaleUnhiddenMsg)
        ).toBeVisible();
        //Toggle Show Hidden
        console.log("Toggle Show Hidden OFF");
        await communityPage.toggleShowHidden();
        await communityPage.expectElementToHaveText(
            communityPage.getCardHeaderTitleLocator(inputName),
            inputName
        );
        await communityPage.expectElementToHaveText(
            communityPage.getCardContentLocator(inputDescr),
            inputDescr
        );

        //Download Pay Scale
        await addedCard
            .locator(communityPage.btnLocator, {
                has: page.locator(communityPage.downloadBtnLocator)
            })
            .click();

        const download = await page.waitForEvent("download");
        if (!fs.existsSync("downloads")) fs.mkdirSync("downloads");

        const downloadedFilePath = `downloads/${await download.suggestedFilename()}`;
        await download.saveAs(downloadedFilePath);

        console.log("File saved to:", downloadedFilePath);
        var downloadedExcelData: string | null;
        if (downloadedFilePath) {
            downloadedExcelData = fs.readFileSync(downloadedFilePath, "utf8");
        } else {
            throw new Error("Download path not found.");
        }

        await communityPage.expectTextNotToBeNull(downloadedExcelData);
        console.log("Downloaded Excel Data:", downloadedExcelData);

        //Delete Pay Scale
        console.log("Delete Pay Scale");
        await addedCard.locator(communityPage.deleteBtnLocator).click();
        //Confirm Delete
        console.log("Confirm Delete");
        await communityPage.verifyDialogHeaderText(
            expectedTexts.deleteDialogHeader
        );
        await communityPage.verifyDialogHeaderContent(
            expectedTexts.deleteDialogContent + inputName + "?"
        );
        await communityPage.click(communityPage.dialogDeleteButtonLocator);
        await expect(
            page.getByText(expectedTexts.payScaleDeletedMsg)
        ).toBeVisible();
    });
    test.skip("Community - Grades - Add, View, Hide, Unhide, Delete ", async ({
        page
    }, testInfo) => {
        //Login
        var loginPage = new LoginPage(page, testInfo);
        await loginPage.navigateTo("/");
        await expect(page).toHaveTitle(expectedTexts.defaultPageTitle);
        await loginPage.expectPageElementsVisibilityOnLoad();
        //Login
        const homepage =
            await test.step(`Login using Tenzing Email`, async () => {
                return await login(page, testInfo);
            });
        await expect(page).toHaveTitle(expectedTexts.adminLoginPageTitle);

        const communityPage =
            await test.step(`Navigate to Commyunity - Pay Scales`, async () => {
                return await homepage.navigateToCommunityPage(testInfo);
            });
        await communityPage.clickGradesLink();
        await communityPage.clickAddNewGradeBtn();
        //Add Grades Dialog
        //Verifying Header and Start Text
        await communityPage.verifyDialogHeaderText(
            expectedTexts.addGradesDialogHeader
        );

        await communityPage.verifyDialogStartText(
            expectedTexts.mountainBgTextForAddGradesDialogPart1,
            expectedTexts.mountainBgTextForAddGradesDialogPart2
        );
        //Filling Name and Description
        const inputName = "Test Grades on " + new Date().getTime();
        const inputDescr =
            "This is test Grades description " + new Date().getTime();
        await communityPage.fillNameInput(inputName);
        await communityPage.fillDescrInput(inputDescr);
        await communityPage.clickDialogNextBtn();
        //Uploading
        //Verifying Header and Start Text
        await communityPage.verifyDialogHeaderText(
            expectedTexts.uploadingGradesDialogHeader
        );

        // await communityPage.verifyDialogStartText(
        //     expectedTexts.mountainBgTextForAddPayScalesDialogPart1,
        //     expectedTexts.mountainBgTextForAddPayScalesDialogPart2
        // );
        // const filePath = path.resolve(paths.payscalesPath);
        // await page
        //     .locator(communityPage.fileUploadInputLocator)
        //     .setInputFiles(filePath);

        // const workbook = XLSX.readFile(filePath);
        // const sheetName = workbook.SheetNames[0];
        // const sheet = workbook.Sheets[sheetName];
        // const jsonData = XLSX.utils.sheet_to_json(sheet, {
        //     header: 1
        // }) as string[][];

        // //Skip first row (header)
        // const dataRows = jsonData.slice(1).filter((row) => row.length > 0);
        // console.log("Data Rows from Excel:", dataRows); // Log data rows

        // //Done: Need to add verification for file uploaded successfully

        // const leftColumnValues = dataRows.map((row) => row[0]);

        // const rightColumnValues = dataRows.map((row) => row[1]);

        // //Limit to first 12 values for comparison
        // const leftColumnSample = leftColumnValues.slice(0, 12);
        // const rightColumnSample = rightColumnValues.slice(0, 12);
        // console.log("Left Column Sample:", leftColumnSample);
        // console.log("Right Column Sample:", rightColumnSample);
        // //Logging all left column values from UI grid
        // const actualLeftColumn = await communityPage.logAllLeftColumnValues();
        // //Logging all right column values from UI grid
        // const actualRightColumn = await communityPage.logAllRightColumnValues();

        // //Remove pound sign from values for comparison
        // // Clean actual UI data
        // const actualCleaned = actualRightColumn.map((v) =>
        //     Number(v.replace(/[£,]/g, "").trim())
        // );

        // // Ensure same type for both sides
        // const expectedCleaned = rightColumnSample.map(Number);

        // console.log("Actual Cleaned:", actualCleaned);
        // console.log("Expected Cleaned:", expectedCleaned);

        // expect(actualCleaned.slice(0, 12)).toEqual(
        //     expectedCleaned.slice(0, 12)
        // );

        // //Done: Check the start text at preview upload dialog
        // await communityPage.verifyDialogStartText(
        //     expectedTexts.mountainBgTextForPreviewUploadDialogPart1,
        //     expectedTexts.mountainBgTextForPreviewUploadDialogPart2
        // );

        // //Save
        // console.log("Save");
        // await communityPage.clickDialogSaveBtn();
        // await expect(
        //     page.getByText(expectedTexts.payScaleSuccessMsg)
        // ).toBeVisible();

        // await page.waitForLoadState("load");

        // //Verify tile created with expected header
        // console.log("Verify tile created with expected header");

        // await communityPage.expectElementToHaveText(
        //     communityPage.getCardHeaderTitleLocator(inputName),
        //     inputName
        // );
        // await communityPage.expectElementToHaveText(
        //     communityPage.getCardContentLocator(inputDescr),
        //     inputDescr
        // );

        // //View Pay Scale Points
        // console.log("View Pay Scale Points");
        // const addedCard = page
        //     .locator(communityPage.cardLocator)
        //     .filter({ hasText: inputName });
        // await addedCard.locator(communityPage.viewBtnLocator).click();
        // await communityPage.verifyDialogHeaderText(
        //     expectedTexts.viewPayScaleDialogHeaderPart + inputName
        // );

        // // Close View Dialog
        // console.log("Close View Dialog");
        // const viewDialog = page.locator(communityPage.dialogLocator);
        // await viewDialog
        //     .locator(communityPage.primaryBtnLocator)
        //     .filter({ hasText: expectedTexts.closeBtnText })
        //     .click();
        // //Verify date
        // const formattedDate = new Date().toLocaleDateString("en-GB");
        // const expectedDateText = "Date Added: " + formattedDate;
        // console.log("expectedDateText: " + expectedDateText);
        // const dateText = await addedCard
        //     .locator(communityPage.dateLabelLocator)
        //     .textContent();
        // console.log("Date Text from UI: " + dateText);
        // expect(dateText?.trim()).toContain(expectedDateText);

        // //Hide Dialog
        // console.log("Hide Dialog");
        // await addedCard.locator(communityPage.archiveBtnLocator).click();

        // //Verify card not visible after archive
        // console.log("Verify card not visible after archive");
        // await expect(
        //     page.locator(communityPage.getCardHeaderTitleLocator(inputName))
        // ).not.toBeVisible();
        // await expect(
        //     page.locator(communityPage.getCardContentLocator(inputDescr))
        // ).not.toBeVisible();
        // await expect(
        //     page.getByText(expectedTexts.payScaleHiddenMsg)
        // ).toBeVisible();

        // //Toggle Show Hidden
        // console.log("Toggle Show Hidden ON");
        // await communityPage.toggleShowHidden();
        // await communityPage.expectElementToHaveText(
        //     communityPage.getCardHeaderTitleLocator(inputName),
        //     inputName
        // );
        // await communityPage.expectElementToHaveText(
        //     communityPage.getCardContentLocator(inputDescr),
        //     inputDescr
        // );
        // //Unhide Pay Scale
        // console.log("Unhide Pay Scale");
        // await addedCard.locator(communityPage.unarchiveBtnLocator).click();
        // //Verify card not visible after unarchive
        // console.log("Verify card not visible after unarchive");
        // await expect(
        //     page.locator(communityPage.getCardHeaderTitleLocator(inputName))
        // ).not.toBeVisible();
        // await expect(
        //     page.locator(communityPage.getCardContentLocator(inputDescr))
        // ).not.toBeVisible();
        // await expect(
        //     page.getByText(expectedTexts.payScaleUnhiddenMsg)
        // ).toBeVisible();
        // //Toggle Show Hidden
        // console.log("Toggle Show Hidden OFF");
        // await communityPage.toggleShowHidden();
        // await communityPage.expectElementToHaveText(
        //     communityPage.getCardHeaderTitleLocator(inputName),
        //     inputName
        // );
        // await communityPage.expectElementToHaveText(
        //     communityPage.getCardContentLocator(inputDescr),
        //     inputDescr
        // );

        // //Download Pay Scale
        // await addedCard
        //     .locator(communityPage.btnLocator, {
        //         has: page.locator(communityPage.downloadBtnLocator)
        //     })
        //     .click();

        // const download = await page.waitForEvent("download");
        // if (!fs.existsSync("downloads")) fs.mkdirSync("downloads");

        // const downloadedFilePath = `downloads/${await download.suggestedFilename()}`;
        // await download.saveAs(downloadedFilePath);

        // console.log("File saved to:", downloadedFilePath);
        // var downloadedExcelData: string | null;
        // if (downloadedFilePath) {
        //     downloadedExcelData = fs.readFileSync(downloadedFilePath, "utf8");
        // } else {
        //     throw new Error("Download path not found.");
        // }

        // await communityPage.expectTextNotToBeNull(downloadedExcelData);
        // console.log("Downloaded Excel Data:", downloadedExcelData);

        // //Delete Pay Scale
        // console.log("Delete Pay Scale");
        // await addedCard.locator(communityPage.deleteBtnLocator).click();
        // //Confirm Delete
        // console.log("Confirm Delete");
        // await communityPage.verifyDialogHeaderText(
        //     expectedTexts.deleteDialogHeader
        // );
        // await communityPage.verifyDialogHeaderContent(
        //     expectedTexts.deleteDialogContent + inputName + "?"
        // );
        // await communityPage.click(communityPage.dialogDeleteButtonLocator);
        // await expect(
        //     page.getByText(expectedTexts.payScaleDeletedMsg)
        // ).toBeVisible();
    });
});
