/**
 * Tazayed Investment Platform - Startup Profile Form JavaScript
 * This script handles the multi-step form functionality for the startup profile creation page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Form navigation
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    let currentStep = 0;

    // Initialize form
    updateFormState();

    // Next button click handler
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Validate current step
            if (validateStep(currentStep)) {
                currentStep++;
                updateFormState();
                window.scrollTo(0, 0);
            }
        });
    });

    // Previous button click handler
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentStep--;
            updateFormState();
            window.scrollTo(0, 0);
        });
    });

    // Update form state based on current step
    function updateFormState() {
        steps.forEach((step, index) => {
            step.classList.remove('active');
            if (index === currentStep) {
                step.classList.add('active');
            }
        });

        progressSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index === currentStep) {
                step.classList.add('active');
            } else if (index < currentStep) {
                step.classList.add('completed');
            }
        });

        // If we're on the review step, populate review data
        if (currentStep === 3) {
            populateReviewData();
        }
    }

    // Validate current step
    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Add error message if it doesn't exist
                let errorMessage = field.parentNode.querySelector('.error-message');
                if (!errorMessage) {
                    errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'هذا الحقل مطلوب';
                    field.parentNode.appendChild(errorMessage);
                }
            } else {
                field.classList.remove('error');
                const errorMessage = field.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });

        return isValid;
    }

    // Populate review data
    function populateReviewData() {
        // Company information
        document.getElementById('review-company-name').textContent = document.getElementById('company-name').value;
        
        const sectorSelect = document.getElementById('company-sector');
        document.getElementById('review-company-sector').textContent = 
            sectorSelect.options[sectorSelect.selectedIndex].text;
        
        const stageSelect = document.getElementById('company-stage');
        document.getElementById('review-company-stage').textContent = 
            stageSelect.options[stageSelect.selectedIndex].text;
        
        document.getElementById('review-company-location').textContent = 
            document.getElementById('company-city').value + ', ' + 
            document.getElementById('company-country').options[document.getElementById('company-country').selectedIndex].text;
        
        // Video preview
        const videoPreview = document.getElementById('review-video');
        videoPreview.innerHTML = '';
        
        if (document.getElementById('video-url').value) {
            // Display embedded video from URL
            const videoUrl = document.getElementById('video-url').value;
            let embedHtml = '';
            
            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                // Extract YouTube video ID
                let videoId = '';
                if (videoUrl.includes('youtube.com/watch?v=')) {
                    videoId = videoUrl.split('v=')[1].split('&')[0];
                } else if (videoUrl.includes('youtu.be/')) {
                    videoId = videoUrl.split('youtu.be/')[1];
                }
                
                if (videoId) {
                    embedHtml = `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
                }
            } else if (videoUrl.includes('vimeo.com')) {
                // Extract Vimeo video ID
                const vimeoId = videoUrl.split('vimeo.com/')[1];
                if (vimeoId) {
                    embedHtml = `<iframe width="100%" height="200" src="https://player.vimeo.com/video/${vimeoId}" frameborder="0" allowfullscreen></iframe>`;
                }
            }
            
            if (embedHtml) {
                videoPreview.innerHTML = embedHtml;
            } else {
                videoPreview.innerHTML = `<div class="review-placeholder">رابط الفيديو: ${videoUrl}</div>`;
            }
        } else if (document.getElementById('video-preview').style.display !== 'none') {
            // Display uploaded video preview
            videoPreview.innerHTML = '<div class="review-placeholder">تم تحميل فيديو</div>';
        } else {
            videoPreview.innerHTML = '<div class="review-placeholder">لم يتم إضافة فيديو</div>';
        }
        
        // Logo preview
        const logoPreview = document.getElementById('review-logo');
        logoPreview.innerHTML = '';
        
        if (document.getElementById('logo-preview').style.display !== 'none') {
            const logoImg = document.getElementById('logo-image').cloneNode(true);
            logoPreview.appendChild(logoImg);
        } else {
            logoPreview.innerHTML = '<div class="review-placeholder">لم يتم إضافة شعار</div>';
        }
        
        // Team preview
        const teamPreview = document.getElementById('review-team');
        teamPreview.innerHTML = '';
        
        const teamMembers = document.querySelectorAll('.team-member');
        teamMembers.forEach((member, index) => {
            const nameInput = member.querySelector(`#member-name-${index + 1}`);
            const positionInput = member.querySelector(`#member-position-${index + 1}`);
            
            if (nameInput && nameInput.value && positionInput && positionInput.value) {
                const memberDiv = document.createElement('div');
                memberDiv.className = 'review-team-member';
                memberDiv.innerHTML = `
                    <strong>${nameInput.value}</strong>
                    <span>${positionInput.value}</span>
                `;
                teamPreview.appendChild(memberDiv);
            }
        });
        
        if (teamPreview.children.length === 0) {
            teamPreview.innerHTML = '<div class="review-placeholder">لم يتم إضافة أعضاء فريق</div>';
        }
        
        // Funding preview
        const fundingStageSelect = document.getElementById('funding-stage');
        document.getElementById('review-funding-stage').textContent = 
            fundingStageSelect.value ? fundingStageSelect.options[fundingStageSelect.selectedIndex].text : 'غير محدد';
        
        const fundingSought = document.getElementById('funding-sought').value;
        document.getElementById('review-funding-sought').textContent = 
            fundingSought ? `$${parseInt(fundingSought).toLocaleString()}` : 'غير محدد';
    }

    // File upload handling
    setupFileUpload('pitch-video', 'video-upload-area', 'video-preview', 'video-player', 'remove-video');
    setupFileUpload('company-logo', 'logo-upload-area', 'logo-preview', 'logo-image', 'remove-logo');
    setupMultipleFileUpload('company-images', 'images-upload-area', 'images-preview');

    function setupFileUpload(inputId, dropAreaId, previewId, previewElementId, removeButtonId) {
        const fileInput = document.getElementById(inputId);
        const dropArea = document.getElementById(dropAreaId);
        const preview = document.getElementById(previewId);
        const previewElement = document.getElementById(previewElementId);
        const removeButton = document.getElementById(removeButtonId);

        // Handle drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            dropArea.classList.add('highlight');
        }

        function unhighlight() {
            dropArea.classList.remove('highlight');
        }

        // Handle file drop
        dropArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                fileInput.files = files;
                handleFiles(files);
            }
        }

        // Handle file selection via input
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });

        // Handle the selected files
        function handleFiles(files) {
            if (files.length === 0) return;
            
            const file = files[0];
            
            // Check if it's a video or image based on input id
            if (inputId === 'pitch-video' && !file.type.startsWith('video/')) {
                alert('الرجاء تحميل ملف فيديو صالح');
                return;
            } else if (inputId === 'company-logo' && !file.type.startsWith('image/')) {
                alert('الرجاء تحميل ملف صورة صالح');
                return;
            }
            
            // Display preview
            const reader = new FileReader();
            
            reader.onload = function(e) {
                if (inputId === 'pitch-video') {
                    previewElement.src = e.target.result;
                    previewElement.play();
                } else {
                    previewElement.src = e.target.result;
                }
                
                preview.style.display = 'block';
                dropArea.style.display = 'none';
            };
            
            reader.readAsDataURL(file);
        }

        // Remove file
        if (removeButton) {
            removeButton.addEventListener('click', function() {
                fileInput.value = '';
                preview.style.display = 'none';
                dropArea.style.display = 'block';
                if (previewElement) {
                    previewElement.src = '';
                }
            });
        }

        // Click on drop area to trigger file input
        dropArea.addEventListener('click', function() {
            fileInput.click();
        });
    }

    function setupMultipleFileUpload(inputId, dropAreaId, previewId) {
        const fileInput = document.getElementById(inputId);
        const dropArea = document.getElementById(dropAreaId);
        const preview = document.getElementById(previewId);

        // Handle drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            dropArea.classList.add('highlight');
        }

        function unhighlight() {
            dropArea.classList.remove('highlight');
        }

        // Handle file drop
        dropArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                fileInput.files = files;
                handleFiles(files);
            }
        }

        // Handle file selection via input
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });

        // Handle the selected files
        function handleFiles(files) {
            if (files.length === 0) return;
            
            // Clear preview
            preview.innerHTML = '';
            
            // Limit to 5 images
            const maxFiles = 5;
            const filesToProcess = Array.from(files).slice(0, maxFiles);
            
            filesToProcess.forEach(file => {
                if (!file.type.startsWith('image/')) {
                    return;
                }
                
                const reader = new FileReader();
                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-preview-item';
                
                reader.onload = function(e) {
                    imageContainer.innerHTML = `
                        <img src="${e.target.result}" alt="صورة الشركة">
                        <button type="button" class="remove-image"><i class="fas fa-times"></i></button>
                    `;
                    
                    // Add remove button functionality
                    const removeButton = imageContainer.querySelector('.remove-image');
                    removeButton.addEventListener('click', function() {
                        imageContainer.remove();
                        
                        // If no images left, show drop area again
                        if (preview.children.length === 0) {
                            dropArea.style.display = 'block';
                        }
                    });
                };
                
                reader.readAsDataURL(file);
                preview.appendChild(imageContainer);
            });
            
            // Hide drop area if images were added
            if (filesToProcess.length > 0) {
                dropArea.style.display = 'none';
            }
        }

        // Click on drop area to trigger file input
        dropArea.addEventListener('click', function() {
            fileInput.click();
        });
    }

    // Tags input handling
    const tagInput = document.getElementById('tag-input');
    const addTagButton = document.getElementById('add-tag');
    const tagsContainer = document.getElementById('tags-container');
    const tagsHiddenInput = document.getElementById('company-tags');
    let tags = [];

    addTagButton.addEventListener('click', addTag);
    tagInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    });

    function addTag() {
        const tagValue = tagInput.value.trim();
        
        if (tagValue && !tags.includes(tagValue)) {
            tags.push(tagValue);
            updateTags();
            tagInput.value = '';
        }
    }

    function updateTags() {
        tagsContainer.innerHTML = '';
        tagsHiddenInput.value = JSON.stringify(tags);
        
        tags.forEach((tag, index) => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.innerHTML = `
                ${tag}
                <span class="remove-tag" data-index="${index}">×</span>
            `;
            tagsContainer.appendChild(tagElement);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-tag').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                tags.splice(index, 1);
                updateTags();
            });
        });
    }

    // Add team member functionality
    const addTeamMemberButton = document.getElementById('add-team-member');
    const teamMembersContainer = document.getElementById('team-members');
    let teamMemberCount = 1;

    addTeamMemberButton.addEventListener('click', function() {
        teamMemberCount++;
        
        const newMember = document.createElement('div');
        newMember.className = 'team-member';
        newMember.innerHTML = `
            <div class="member-header">
                <h4>عضو فريق ${teamMemberCount}</h4>
                <button type="button" class="remove-member" data-member="${teamMemberCount}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="member-name-${teamMemberCount}">الاسم <span class="required">*</span></label>
                    <input type="text" id="member-name-${teamMemberCount}" name="member-name-${teamMemberCount}" required>
                </div>
                
                <div class="form-group">
                    <label for="member-position-${teamMemberCount}">المنصب <span class="required">*</span></label>
                    <input type="text" id="member-position-${teamMemberCount}" name="member-position-${teamMemberCount}" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="member-bio-${teamMemberCount}">نبذة مختصرة <span class="required">*</span></label>
                <textarea id="member-bio-${teamMemberCount}" name="member-bio-${teamMemberCount}" rows="3" required></textarea>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="member-linkedin-${teamMemberCount}">LinkedIn</label>
                    <input type="url" id="member-linkedin-${teamMemberCount}" name="member-linkedin-${teamMemberCount}" placeholder="https://linkedin.com/in/...">
                </div>
                
                <div class="form-group">
                    <label for="member-photo-${teamMemberCount}">الصورة الشخصية</label>
                    <input type="file" id="member-photo-${teamMemberCount}" name="member-photo-${teamMemberCount}" accept="image/*">
                </div>
            </div>
        `;
        
        teamMembersContainer.appendChild(newMember);
        
        // Add remove functionality
        const removeButton = newMember.querySelector('.remove-member');
        removeButton.addEventListener('click', function() {
            const memberIndex = this.getAttribute('data-member');
            this.closest('.team-member').remove();
        });
    });

    // Character counter for description
    const descriptionTextarea = document.getElementById('company-description');
    const charCount = document.getElementById('desc-chars');
    
    descriptionTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        charCount.textContent = currentLength;
        
        if (currentLength > 2000) {
            charCount.classList.add('over-limit');
        } else {
            charCount.classList.remove('over-limit');
        }
    });

    // Form submission
    const form = document.getElementById('startup-profile-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Final validation
        if (!validateStep(currentStep) || !document.getElementById('terms-agree').checked) {
            alert('الرجاء التأكد من ملء جميع الحقول المطلوبة والموافقة على الشروط والأحكام');
            return;
        }
        
        // Here you would normally submit the form data to the server
        // For this demo, we'll just show a success message
        
        // Create a success message
        const formContainer = document.querySelector('.form-container');
        formContainer.innerHTML = `
            <div class="submission-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>تم إرسال ملف شركتك بنجاح!</h2>
                <p>شكراً لك على إنشاء ملف شركتك على منصة تزايد. سيقوم فريقنا بمراجعة المعلومات المقدمة ونشر ملف شركتك في أقرب وقت ممكن.</p>
                <p>سيتم إرسال إشعار إلى بريدك الإلكتروني عند اكتمال المراجعة ونشر ملف شركتك.</p>
                <div class="success-buttons">
                    <a href="index.html" class="btn btn-primary">العودة إلى الرئيسية</a>
                </div>
            </div>
        `;
    });

    // FAQ toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.faq-toggle i');
            
            // Toggle answer visibility
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                icon.className = 'fas fa-plus';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.className = 'fas fa-minus';
            }
        });
    });
});
