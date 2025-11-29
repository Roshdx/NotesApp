package com.notes.apigateway.controller;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/diagnostic")
public class DiagnosticController {

    private final DiscoveryClient discoveryClient;

    public DiagnosticController(DiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }

    @GetMapping("/services")
    public Map<String, Object> getAllServices() {
        Map<String, Object> result = new HashMap<>();
        List<String> services = discoveryClient.getServices();
        result.put("registeredServices", services);

        Map<String, List<Map<String, Object>>> serviceDetails = new HashMap<>();
        for (String service : services) {
            List<ServiceInstance> instances = discoveryClient.getInstances(service);
            List<Map<String, Object>> instanceDetails = instances.stream()
                .map(instance -> {
                    Map<String, Object> details = new HashMap<>();
                    details.put("serviceId", instance.getServiceId());
                    details.put("host", instance.getHost());
                    details.put("port", instance.getPort());
                    details.put("uri", instance.getUri().toString());
                    details.put("secure", instance.isSecure());
                    details.put("metadata", instance.getMetadata());
                    return details;
                })
                .toList();
            serviceDetails.put(service, instanceDetails);
        }
        result.put("serviceInstances", serviceDetails);

        return result;
    }

    @GetMapping("/services/{serviceName}")
    public Map<String, Object> getServiceInfo(@PathVariable String serviceName) {
        Map<String, Object> result = new HashMap<>();
        List<ServiceInstance> instances = discoveryClient.getInstances(serviceName);

        if (instances.isEmpty()) {
            result.put("error", "No instances found for service: " + serviceName);
            result.put("availableServices", discoveryClient.getServices());
        } else {
            result.put("serviceName", serviceName);
            result.put("instanceCount", instances.size());
            List<Map<String, Object>> instanceDetails = instances.stream()
                .map(instance -> {
                    Map<String, Object> details = new HashMap<>();
                    details.put("serviceId", instance.getServiceId());
                    details.put("host", instance.getHost());
                    details.put("port", instance.getPort());
                    details.put("uri", instance.getUri().toString());
                    details.put("scheme", instance.getScheme());
                    return details;
                })
                .toList();
            result.put("instances", instanceDetails);
        }

        return result;
    }
}
