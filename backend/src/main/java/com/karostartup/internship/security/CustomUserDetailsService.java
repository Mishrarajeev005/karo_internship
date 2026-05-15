package com.karostartup.internship.security;

import com.karostartup.internship.model.Admin;
import com.karostartup.internship.model.Company;
import com.karostartup.internship.repository.AdminRepository;
import com.karostartup.internship.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to find in Admin
        Optional<Admin> admin = adminRepository.findByUsername(username);
        if (admin.isPresent()) {
            return new User(admin.get().getUsername(), admin.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
        }

        // Try to find in Company (using email as username)
        Optional<Company> company = companyRepository.findByEmail(username);
        if (company.isPresent()) {
            return new User(company.get().getEmail(), company.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_COMPANY")));
        }

        throw new UsernameNotFoundException("User not found with username: " + username);
    }
}
