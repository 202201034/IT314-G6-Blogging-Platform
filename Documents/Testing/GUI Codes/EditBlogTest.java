// Generated by Selenium IDE
import org.junit.Test;
import org.junit.Before;
import org.junit.After;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.core.IsNot.not;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Alert;
import org.openqa.selenium.Keys;
import java.util.*;
import java.net.MalformedURLException;
import java.net.URL;
public class EditBlogTest {
  private WebDriver driver;
  private Map<String, Object> vars;
  JavascriptExecutor js;
  @Before
  public void setUp() {
    driver = new ChromeDriver();
    js = (JavascriptExecutor) driver;
    vars = new HashMap<String, Object>();
  }
  @After
  public void tearDown() {
    driver.quit();
  }
  @Test
  public void editBlog() {
    driver.get("https://it-314-g6-blogging-platform.vercel.app/");
    driver.manage().window().setSize(new Dimension(1552, 832));
    driver.findElement(By.cssSelector(".fa-user")).click();
    {
      WebElement element = driver.findElement(By.cssSelector(".fa-user"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element).perform();
    }
    {
      WebElement element = driver.findElement(By.tagName("body"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element, 0, 0).perform();
    }
    driver.findElement(By.cssSelector(".block:nth-child(1)")).click();
    {
      WebElement element = driver.findElement(By.tagName("body"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element, 0, 0).perform();
    }
    {
      WebElement element = driver.findElement(By.tagName("body"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element, 0, 0).perform();
    }
    driver.findElement(By.cssSelector(".bg-gray-50:nth-child(3) p")).click();
    driver.findElement(By.cssSelector(".px-4:nth-child(3)")).click();
    driver.findElement(By.cssSelector("p:nth-child(4)")).click();
    {
      WebElement element = driver.findElement(By.cssSelector(".ql-snow > .ql-editor"));
      js.executeScript("if(arguments[0].contentEditable === 'true') {arguments[0].innerText = '<p><span class=\"ql-size-small\">Small</span> Normal <span class=\"ql-size-large\">Large</span> <span class=\"ql-size-huge\">Huge</span></p><p>Sans <span class=\"ql-font-serif\">Serif</span> <span class=\"ql-font-monospace\">MonoSpace</span></p><p><strong>Bold</strong> <em>Italic</em> <u>Underline </u><s>Strikethrough</s></p><p>Publishing the blog</p><p>Edited the blog1</p><p>Edits done</p>'}", element);
    }
    driver.findElement(By.cssSelector(".justify-between > .px-4")).click();
    driver.findElement(By.cssSelector(".fa-user > path")).click();
    {
      WebElement element = driver.findElement(By.cssSelector(".fa-user > path"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element).perform();
    }
    {
      WebElement element = driver.findElement(By.tagName("body"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element, 0, 0).perform();
    }
    driver.findElement(By.cssSelector(".block:nth-child(1)")).click();
    js.executeScript("window.scrollTo(0,0)");
    driver.findElement(By.cssSelector(".bg-gray-50:nth-child(3)")).click();
  }
}
