import base, { expect, Locator, Page } from "@playwright/test";
import logger from "../logging/logger";
/**
 * @author: @pruthvirajqa2dev
 * Base page class to inherit basic page functionality
 */
/**
 * The `BasePage` class serves as an abstract base class for all page objects in the application.
 * It provides common locators and methods for interacting with web elements and performing actions on the page.
 *
 * @abstract
 */
export default abstract class BasePage {
    protected page: Page;
    //Constructor
    constructor(page: Page, testInfo: any) {
        this.page = page;
    }
    //Locators
    
    //Actions

    // Common navigation methods
    /**
     * This function is for navigating to provided resource/endpoint
     * @param url
     */
    async navigateTo(url: string) {
        await this.page.goto(url);
    }
    /**
     *
     */
    async navigateBack() {
        await this.page.goBack();
    }
    /**
     *
     */
    async navigateForward() {
        await this.page.goForward();
    }

    // Common element interaction methods
    /**
     *
     * @param locator
     */
    async click(locator: string) {
        await this.page.locator(locator).first().click();
    }
    /**
     *
     * @param locator
     */
    async dblClick(locator: string) {
        await this.page.locator(locator).first().dblclick();
    }
    /**
     *
     * @param locator
     */
    async check(locator: string) {
        await this.page.check(locator);
    }
    /**
     *
     * @param locator
     */
    async checkAndVerify(locator: string) {
        await this.check(locator);
        expect(await this.page.isChecked(locator)).toBeTruthy();
    }
    /**
     *
     * @param locator
     * @param text
     */
    async fill(locator: string, text: string) {
        await this.page.locator(locator).click();
        await this.page.locator(locator).fill(text, { force: true });
    }
    /**
     *
     * @param locator
     * @param text
     */
    async fillTextAndVerify(locator: string, text: string) {
        // Fill text
        logger.info(`Fill text ${text} in locator ${locator}`);
        await this.fill(locator, text);
        //Verify Text filled
        logger.info(`Expecting text ${text} in locator ${locator}`);
        await this.expectElementToContainText(locator, text);
    }
    /**
     *
     * @param locator
     * @param text
     */
    async fillTextAndVerifyValue(locator: string, value: string) {
        // Fill text
        logger.info(`Fill text ${value} in locator ${locator}`);
        await this.fill(locator, value);
        //Verify Text filled
        logger.info(`Expecting value ${value} in locator ${locator}`);
        await this.expectElementToContainText(locator, value);
    }
    /**
     *
     * @param locator
     * @param value
     */
    async selectOption(locator: string, value: string) {
        await this.page.locator(locator).selectOption(value);
    }

    // Advanced element interaction methods
    /**
     *
     * @param role
     * @param options
     * @returns
     */
    async getByRole(
        role:"alert"|"alertdialog"|"application"|"article"|"banner"|"blockquote"|"button"|"caption"|"cell"|"checkbox"|"code"|"columnheader"|"combobox"|"complementary"|"contentinfo"|"definition"|"deletion"|"dialog"|"directory"|"document"|"emphasis"|"feed"|"figure"|"form"|"generic"|"grid"|"gridcell"|"group"|"heading"|"img"|"insertion"|"link"|"list"|"listbox"|"listitem"|"log"|"main"|"marquee"|"math"|"meter"|"menu"|"menubar"|"menuitem"|"menuitemcheckbox"|"menuitemradio"|"navigation"|"none"|"note"|"option"|"paragraph"|"presentation"|"progressbar"|"radio"|"radiogroup"|"region"|"row"|"rowgroup"|"rowheader"|"scrollbar"|"search"|"searchbox"|"separator"|"slider"|"spinbutton"|"status"|"strong"|"subscript"|"superscript"|"switch"|"tab"|"table"|"tablist"|"tabpanel"|"term"|"textbox"|"time"|"timer"|"toolbar"|"tooltip"|"tree"|"treegrid"|"treeitem",
        options?: { name?: string; hidden?: boolean; exact?: boolean }
    ): Promise<Locator> {
        return this.page.getByRole(role, options);
    }
    /**
     *
     * @param label
     * @returns
     */
    async getByLabel(
        label: string,
        options?: { name?: string; hidden?: boolean; exact?: boolean }
    ): Promise<Locator> {
        return this.page.getByLabel(label, options);
    }
    /**
     *
     * @param placeholder
     * @returns
     */
    async getByPlaceholder(placeholder: string): Promise<Locator> {
        return this.page.getByPlaceholder(placeholder);
    }
    /**
     *
     * @param altText
     * @returns Promise<Locator>
     */
    async getByAltText(altText: string): Promise<Locator> {
        return this.page.getByAltText(altText);
    }
    /**
     *This function returns located element using provided text
     * @param text
     * @returns
     */
    async getByText(text: string): Promise<Locator> {
        return await this.page.getByText(text, { exact: true });
    }
    /**
     * This function returns located element using provided heading
     * @param heading
     * @returns
     */
    async getByHeading(heading: string): Promise<Locator> {
        return this.page.getByRole("heading", { name: heading, exact: true });
    }

    async getByLocator(locator: string): Promise<Locator> {
        return this.page.locator(locator);
    }
    // Assertions
    /**
     *
     * @param locator
     */
    async expectElementToBeVisibleUsingLocator(
        locator: string,
        p0?: { timeout: number }
    ) {
        if (typeof p0 !== "undefined") {
            await expect(this.page.locator(locator).first()).toBeVisible(p0);
        } else {
            await expect(this.page.locator(locator).first()).toBeVisible();
        }
    }
    /**
     *
     * @param locator
     */
    async expectElementToBeHidden(locator: string) {
        await expect(this.page.locator(locator)).toBeHidden();
    }
    /**
     *
     * @param locator
     * @param text
     */
    async expectElementToHaveText(locator: string, text: string) {
        await expect(
            this.page.locator(locator).first(),
            "Check if page element has text :" + text
        ).toHaveText(text);
    }
    /**
     *
     * @param locator
     * @param text
     */
    async expectElementToContainText(locator: string, text: string) {
        await expect(
            this.page.locator(locator).first(),
            "Check if page element contains text :" + text
        ).toContainText(text);
    }
    /**
     *
     * @param locator
     * @param value
     */
    async expectElementToHaveValue(locator: string, value: string) {
        await expect(
            this.page.locator(locator).first(),
            "Check if page element has value :" + value
        ).toHaveValue(value);
    }
    /**
     * This function checks if a provided attribute with provided value is present in the element locator by provided locator
     * @param locator
     * @param attr
     * @param value
     */
    async expectElementToHaveAttributeWithValue(
        locator: string,
        attr: string,
        value: string
    ) {
        await expect(
            this.page.locator(locator).first(),
            "Check if page element has attr :" + attr + " with value " + value
        ).toHaveAttribute(attr, value);
    }
    /**
     *
     * @param locator
     * @param value
     */
    async expectElementToContainValue(locator: string, value: string) {
        const actualText = await this.page
            .locator(locator)
            .first()
            .inputValue();
        const actualValue = parseFloat(actualText);
        const expectedValue = parseFloat(value);
        console.log(
            `Actual Value: ${actualValue} Expected Value: ${expectedValue}`
        );
        expect(
            parseFloat(Math.abs(actualValue - expectedValue).toPrecision(2))
        ).toBeLessThanOrEqual(0.01);
    }
    // Additional methods (as needed)
    /**
     *
     * @param path
     */
    async screenshot(path: string) {
        await this.page.screenshot({ path });
    }
    /**
     *
     * @returns
     */
    async getURL(): Promise<string> {
        return this.page.url();
    }

    /**
     * This function verifies current URL is the provided URL
     * @param url
     */
    async verifyURL(url: string) {
        await expect(this.page.url()).toBe(url);
    }

    /**
     * This function returns boolean whether the heading is visible on page located by provided text
     * @param headingText
     * @returns
     */
    async isHeadingVisibleByText(headingText: string): Promise<boolean> {
        return (
            await this.getByRole("heading", { name: headingText })
        ).isVisible();
    }
    /**
     * This function clicks the heading on page located by provided text
     * @param headingText
     */
    async clickHeadingByText(headingText: string) {
        await (await this.getByRole("heading", { name: headingText })).click();
    }

    /**
     *
     * @param text
     */
    async clickElementByText(text: string) {
        await (await this.getByText(text)).click();
    }
    /**
     * This function wraps the function to find the element using role
     * @param name
     */
    async clickButtonUsingRole(name: string) {
        await this.page
            .getByRole("button", {
                name: name,
                exact: true
            })
            .click();
    }
   
    /**
     *
     * @param text
     */
    async expectTextNotToBeNull(text: string | null) {
        expect(text).not.toBeNull();
    }
    
    /**
     *
     * @param page
     * @param url
     */
    async verifyPageURL(page: Page, url: string) {
        expect(page.url()).toContain(url);
    }
   
    /**
     *
     * @param locator
     */
    async scrollToElementUsingHandle(locator: string) {
        const elementHandle = await this.page.locator(locator).elementHandle();
        await elementHandle?.scrollIntoViewIfNeeded();
    }
    
}