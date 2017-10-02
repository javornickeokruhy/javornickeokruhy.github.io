package cz.javornickeokruhy;

import java.io.IOException;
import java.io.Serializable;
import java.util.logging.Logger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebFilter(urlPatterns={"*.gpx", "*.kml"})
@SuppressWarnings("serial")
public class Headers implements Filter, Serializable {

    private static final Logger log = Logger.getLogger(Headers.class.getName());
    
	@Override
	public void init(FilterConfig config) throws ServletException {
		log.info("Creating filter");
	}
	
	@Override
	public void destroy() {
		log.info("Destroying filter");
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpServletResponse httpResponse = (HttpServletResponse) response;
		
		if(httpRequest.getRequestURI().endsWith(".gpx"))
			httpResponse.setContentType("application/gpx+xml"); //openshift returns text/plain
		
		httpResponse.addHeader("Content-Disposition", "attachment");
		
        chain.doFilter(request, response);
	}

}//application/gpx+xml