package cz.javornickeokruhy;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.Serializable;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(value="/data", loadOnStartup=1)
@SuppressWarnings("serial")
public class Data extends HttpServlet implements Serializable {

    private static final Logger log = Logger.getLogger(Data.class.getName());
    
	@Override
	public void init(ServletConfig config) throws ServletException {
		log.info("Creating Data servlet");
		super.init(config);
	}
	
	@Override
	public void destroy() {
		log.info("Destroying Data servlet");
		super.destroy();
	}

    /*------------------------------------------------------------------------*/
    /* Actions                                                                */
    /*------------------------------------------------------------------------*/
    
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.info("Action - doGet");
		
		handleRequest(request, response);
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.info("Action - doPost");
		
		handleRequest(request, response);
	}
	
	private void handleRequest(HttpServletRequest request, HttpServletResponse response) {
		try {
		    request.setCharacterEncoding("utf-8");
		    
			String type = request.getParameter("type");
			log.info("  type=" + type);
			
			if(type != null) {
				if("contact".equals(type))
					sendMail(request, response);
			}
		}
		catch(Exception e) {
			log.severe("Exception in handling request. " + getStackTrace(e));
			sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error perfoming the action.", request, response);
			return;
		}
	}
	
    /*------------------------------------------------------------------------*/
    /* Utils                                                                  */
    /*------------------------------------------------------------------------*/

	private void sendMail(HttpServletRequest request, HttpServletResponse response) {
	    try {
    		String name = request.getParameter("name");
    		String email = request.getParameter("email");
    		String honeypot = request.getParameter("website");
    		String text = request.getParameter("message");
    		
    		if(honeypot != null  &&  !"".equals(honeypot)) {
    		    log.severe("Honeypot " + request.getRemoteHost());
    		    sendResponse("Zpráva nebyla odeslána. Špatně vyplňěný formulář.", request, response);
    		    return;
    		}
    		
    		//http://stackoverflow.com/a/3649148
    		GoogleMail.Send("", "", "", "Kontaktní Formulář", name + "\n" + email + "\n\n" + text);
			
			sendResponse("Zpráva odeslána.", request, response);
		}
		catch(Exception e) {
		    log.severe("Exception in sending mail. " + getStackTrace(e));
			sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Zprávu se nepodařilo odeslat.", request, response);
			return;
		}
	}

	private void sendResponse(String responseText, HttpServletRequest request, HttpServletResponse response) {
		log.info("  return=" + responseText);
		
		try {
			OutputStream out = response.getOutputStream();
			response.setContentType("text/plain");
			response.setCharacterEncoding("utf-8");
			out.write(responseText.getBytes("utf-8"));
			out.flush();
			out.close();
		}
		catch(IOException e) {
			log.severe("Exception in writing response. " + getStackTrace(e));
		}
	}
	
	private void sendError(int httpServletResponse, String message, HttpServletRequest request, HttpServletResponse response) {
        response.setStatus(httpServletResponse);
        sendResponse(message, request, response);
	}
	
	private static String getStackTrace(Throwable t) {
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		t.printStackTrace(pw);
		return sw.toString();
	}
	
}
